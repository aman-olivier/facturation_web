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

async function testSignup() {
  const { data, error } = await supabase.auth.signUp({
    email: 'ahimoucorp@gmail.com',
    password: 'password123',
  });
  console.log('Data:', JSON.stringify(data, null, 2));
  console.log('Error:', error);
}

testSignup();
