-- Migration: Drop legacy columns 'company' and 'avatar_url' from 'clients' table if they exist
ALTER TABLE clients DROP COLUMN IF EXISTS company;
ALTER TABLE clients DROP COLUMN IF EXISTS avatar_url;
