const http = require('http');
const { app } = require('./dist/src/app.js');
const server = http.createServer(app);
server.listen(0, () => {
  const port = server.address().port;
  const req = http.request({
    host: '127.0.0.1',
    port,
    path: '/api/v1/auth/register',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      console.log('STATUS', res.statusCode);
      console.log(data.slice(0, 400));
      server.close();
    });
  });
  req.write(JSON.stringify({ firstName: 'Test', lastName: 'User', email: 'test@example.com', password: 'Password123!', confirmPassword: 'Password123!' }));
  req.end();
});
