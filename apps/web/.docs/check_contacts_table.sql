-- Check if the contacts table exists in the public schema
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'contacts'
);

-- Show table structure if it exists
SELECT column_name, data_type, character_maximum_length 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'contacts'
ORDER BY ordinal_position;
