const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, ...values] = line.split('=');
  if (key && values.length) {
    env[key.trim()] = values.join('=').trim().replace(/^"|"$/g, '');
  }
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function testInsert() {
  const { data, error } = await supabase.from('clients').insert([{
    name: 'Test Client',
    phone: '123456789',
    email: 'test@client.com',
    address: '123 Test St'
  }]).select().single();
  
  console.log('Data:', JSON.stringify(data, null, 2));
  console.log('Error:', error);
}

testInsert();
