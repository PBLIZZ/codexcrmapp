-- Drop the old global email unique constraint
ALTER TABLE public.clients DROP CONSTRAINT IF EXISTS clients_email_key;

-- Add a new composite unique constraint for user_id and email
ALTER TABLE public.clients ADD CONSTRAINT clients_user_id_email_key UNIQUE (user_id, email);