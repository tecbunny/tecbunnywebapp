const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const p = await prisma.product.findUnique({ where: { id: '00969cda-f8b8-4bcb-824f-60404106cfd8' } });
  console.log(JSON.stringify(p.images, null, 2));
}

main().finally(() => prisma.$disconnect());
