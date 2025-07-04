-- Migration to add groups and group members tables
-- This supports the contact groups functionality in the application

-- Create groups table
CREATE TABLE IF NOT EXISTS public.groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_groups_user_id ON public.groups(user_id);

-- Create group_members junction table for many-to-many relationship
CREATE TABLE IF NOT EXISTS public.group_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(group_id, client_id)  -- Prevent duplicate memberships
);

-- Add indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON public.group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_client_id ON public.group_members(client_id);

-- Add comments for documentation
COMMENT ON TABLE public.groups IS 'Stores contact groups that clients can be organized into';
COMMENT ON COLUMN public.groups.user_id IS 'The user who owns this group';
COMMENT ON COLUMN public.groups.name IS 'Name of the group';
COMMENT ON COLUMN public.groups.color IS 'Color code for the group (e.g., #FF0000 for red)';

COMMENT ON TABLE public.group_members IS 'Junction table for many-to-many relationship between groups and clients';
COMMENT ON COLUMN public.group_members.group_id IS 'Reference to the group';
COMMENT ON COLUMN public.group_members.client_id IS 'Reference to the client in the group';

-- Create a function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to update the updated_at column on groups table
DROP TRIGGER IF EXISTS update_groups_updated_at ON public.groups;
CREATE TRIGGER update_groups_updated_at
BEFORE UPDATE ON public.groups
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Set up Row Level Security (RLS) policies for groups
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;

-- Users can only see their own groups
CREATE POLICY "Users can view their own groups"
ON public.groups
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own groups
CREATE POLICY "Users can insert their own groups"
ON public.groups
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own groups
CREATE POLICY "Users can update their own groups"
ON public.groups
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own groups
CREATE POLICY "Users can delete their own groups"
ON public.groups
FOR DELETE
USING (auth.uid() = user_id);

-- Set up RLS for group_members
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

-- Users can only see group members for groups they own
CREATE POLICY "Users can view members of their groups"
ON public.group_members
FOR SELECT
USING (EXISTS (
    SELECT 1 FROM public.groups g 
    WHERE g.id = group_members.group_id AND g.user_id = auth.uid()
));

-- Users can add members to their own groups
CREATE POLICY "Users can add members to their groups"
ON public.group_members
FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.groups g 
        WHERE g.id = group_members.group_id AND g.user_id = auth.uid()
    )
    AND
    EXISTS (
        SELECT 1 FROM public.clients c 
        WHERE c.id = group_members.client_id AND c.user_id = auth.uid()
    )
);

-- Users can remove members from their groups
CREATE POLICY "Users can remove members from their groups"
ON public.group_members
FOR DELETE
USING (EXISTS (
    SELECT 1 FROM public.groups g 
    WHERE g.id = group_members.group_id AND g.user_id = auth.uid()
));

-- Create a function to check if a user can manage a group
CREATE OR REPLACE FUNCTION public.can_manage_group(group_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.groups g 
        WHERE g.id = group_id AND g.user_id = auth.uid()
    );
$$;
