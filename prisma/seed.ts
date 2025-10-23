import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  const alice = await prisma.user.upsert({
    where: { email: "alice@example.com" },
    update: {},
    create: {
      email: "alice@example.com",
      passwordHash,
      name: "Alice Reader"
    }
  });

  await prisma.book.upsert({
    where: { id: "seed-book-1" },
    update: {},
    create: {
      id: "seed-book-1",
      title: "The Local Library",
      author: "Share A. Book",
      description: "A starter book for the Share-A-Book community.",
      ownerId: alice.id,
      imagePath: null
    }
  });
}

main()
  .catch(async (error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
