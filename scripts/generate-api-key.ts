import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function generateApiKey() {
  const name = process.argv[2] || 'Default API Key';
  const description = process.argv[3] || 'Generated API key';

  const key = `nsk_${uuidv4().replace(/-/g, '')}`;

  const apiKey = await prisma.apiKey.create({
    data: {
      key,
      name,
      description,
      isActive: true,
    },
  });

  console.log('\nAPI Key generated successfully:');
  console.log(`Key: ${apiKey.key}`);
  console.log(`Name: ${apiKey.name}`);
  console.log(`ID: ${apiKey.id}`);
  console.log('\n⚠️  Store this key securely. It will not be shown again.\n');
}

generateApiKey()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

