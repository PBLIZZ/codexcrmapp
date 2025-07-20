// Let's fix the database connection by using the Supabase database directly
// Based on your SUPABASE_URL: ppzaajcutzyluffvbnrg.supabase.co

// First let me create a simple test to verify our tables exist
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ppzaajcutzyluffvbnrg.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwemFhamN1dHp5bHVmZnZibnJnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDk5NDI1OCwiZXhwIjoyMDYwNTcwMjU4fQ.DYwZRhVuXQCTTgKyJUURJXGMYUtlq4_-GvRY2IfrCEw';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    // Test basic connection
    const { data, error } = await supabase.from('contacts').select('count', { count: 'exact' });
    
    if (error) {
      console.error('❌ Supabase connection failed:', error);
      return false;
    }
    
    console.log('✅ Supabase connection successful!');
    console.log(`📊 Contacts table exists and has ${data.length} rows`);
    
    // Test other tables
    const { data: groups } = await supabase.from('groups').select('count', { count: 'exact' });
    console.log(`📊 Groups table exists and has ${groups?.length || 0} rows`);
    
    const { data: groupMembers } = await supabase.from('group_members').select('count', { count: 'exact' });
    console.log(`📊 Group members table exists and has ${groupMembers?.length || 0} rows`);
    
    return true;
    
  } catch (error) {
    console.error('❌ Error testing Supabase:', error);
    return false;
  }
}

// Function to update the .env.local file with the correct DATABASE_URL
function generateDatabaseUrl() {
  const host = 'aws-0-eu-west-3.pooler.supabase.com';
  const port = '6543';
  const database = 'postgres';
  const user = 'postgres.ppzaajcutzyluffvbnrg';
  const password = '[YOUR_DB_PASSWORD]'; // You'll need to get this from your Supabase dashboard
  
  const databaseUrl = `postgresql://${user}:${password}@${host}:${port}/${database}?sslmode=require`;
  const directUrl = `postgresql://${user}:${password}@aws-0-eu-west-3.pooler.supabase.com:5432/${database}?sslmode=require`;
  
  console.log('');
  console.log('🔧 To fix your database connection, add these to your .env.local:');
  console.log('');
  console.log(`DATABASE_URL="${databaseUrl}"`);
  console.log(`DIRECT_URL="${directUrl}"`);
  console.log('');
  console.log('Replace [YOUR_DB_PASSWORD] with your actual Supabase database password');
  console.log('You can find this in your Supabase dashboard under Settings > Database');
}

async function main() {
  const isConnected = await testSupabaseConnection();
  
  if (!isConnected) {
    console.log('');
    console.log('🚨 Since we can\'t connect to the database, let\'s create some test data...');
    generateDatabaseUrl();
  }
}

main();
