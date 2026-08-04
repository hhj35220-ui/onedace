import { prisma } from './src/config/database';

(async () => {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, firstName: true, lastName: true, role: true, isActive: true },
    take: 20,
  });

  const orgs = await prisma.organization.findMany({
    select: { id: true, name: true, ownerId: true },
    take: 20,
  });

  const memberships = await prisma.organizationMember.findMany({
    select: { userId: true, organizationId: true, role: true },
    take: 20,
  });

  console.log(JSON.stringify({ users, orgs, memberships }, null, 2));
  await prisma.$disconnect();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});