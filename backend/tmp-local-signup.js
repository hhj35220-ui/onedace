const http = require('http');
const payload = JSON.stringify({ firstName: 'Local', lastName: 'Test', email: 'local-test2@example.com', password: 'Password123!', confirmPassword: 'Password123!' });
const req = http.request({ hostname: '127.0.0.1', port: 3000, path: '/api/v1/auth/register', method: 'POST', headers: { 'Content-Type': 'application/json' } }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('STATUS', res.statusCode);
    console.log(data);
  });
});
req.on('error', (err) => { console.error(err); process.exit(1); });
req.write(payload);
req.end();
