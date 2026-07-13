const fetch = require('node-fetch');

async function test() {
  const res = await fetch('https://api.tecbunny.com/api/health');
  const text = await res.text();
  console.log('Status:', res.status);
  console.log('Response:', text);
}
test();
