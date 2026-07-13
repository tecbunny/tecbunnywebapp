const fetch = require('node-fetch');

async function test() {
  const res = await fetch('http://localhost:3000/api/auth/extension', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'foo', password: 'bar' })
  });
  const text = await res.text();
  console.log('Status:', res.status);
  console.log('Response:', text);
}
test();
