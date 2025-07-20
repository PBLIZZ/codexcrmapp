// Test your actual data to see what's in the database
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ppzaajcutzyluffvbnrg.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwemFhamN1dHp5bHVmZnZibnJnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDk5NDI1OCwiZXhwIjoyMDYwNTcwMjU4fQ.DYwZRhVuXQCTTgKyJUURJXGMYUtlq4_-GvRY2IfrCEw';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testActualData() {
  try {
    console.log('🔍 Testing actual data in your database...');
    
    // Get contacts
    const { data: contacts, error: contactError } = await supabase
      .from('contacts')
      .select('*');
    
    if (contactError) {
      console.error('❌ Error fetching contacts:', contactError);
    } else {
      console.log('✅ Contacts data:');
      console.log(JSON.stringify(contacts, null, 2));
    }
    
    // Get groups
    const { data: groups, error: groupError } = await supabase
      .from('groups')
      .select('*');
    
    if (groupError) {
      console.error('❌ Error fetching groups:', groupError);
    } else {
      console.log('✅ Groups data:');
      console.log(JSON.stringify(groups, null, 2));
    }
    
    // Get group members
    const { data: groupMembers, error: groupMemberError } = await supabase
      .from('group_members')
      .select('*');
    
    if (groupMemberError) {
      console.error('❌ Error fetching group members:', groupMemberError);
    } else {
      console.log('✅ Group members data:');
      console.log(JSON.stringify(groupMembers, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testActualData();
