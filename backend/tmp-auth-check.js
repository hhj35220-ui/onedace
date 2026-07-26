const jwt = require('jsonwebtoken');
const { config } = require('./dist/config/env.js');
const { prisma } = require('./dist/config/database.js');

(async () => {
  const userId = '72d4e6c2-2324-46c1-bacf-45f5279dd64e';
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, role: true } });
  console.log('user from db', user);
  const token = jwt.sign({ sub: userId, email: 'verify@example.com', role: 'USER' }, config.JWT_SECRET, { expiresIn: '15m' });
  const decoded = jwt.verify(token, config.JWT_SECRET);
  console.log('decoded', decoded);
})();
