const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function waitForDb() {
  let retries = 30;
  while (retries > 0) {
    try {
      await prisma.$connect();
      console.log('Database is ready!');
      await prisma.$disconnect();
      return;
    } catch (error) {
      retries--;
      if (retries === 0) {
        console.error('Database connection failed after 30 retries');
        process.exit(1);
      }
      console.log('Database is unavailable - sleeping...');
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

waitForDb().catch((error) => {
  console.error('Error waiting for database:', error);
  process.exit(1);
});

