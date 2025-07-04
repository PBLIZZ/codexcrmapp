-- Create groups table
CREATE TABLE IF NOT EXISTS groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  color TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- Create contact_groups junction table for many-to-many relationship
CREATE TABLE IF NOT EXISTS contact_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(contact_id, group_id)
);

-- Set up Row Level Security (RLS) for groups
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only see their own groups" 
  ON groups FOR ALL USING (auth.uid() = user_id);

-- Set up Row Level Security (RLS) for contact_groups
ALTER TABLE contact_groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only see their own contact_group relationships" 
  ON contact_groups FOR ALL USING (auth.uid() = user_id);
