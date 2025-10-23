import { describe, expect, it } from "vitest";
import bcrypt from "bcryptjs";
import {
  createBook,
  listBooks,
  getBook,
  deleteBook
} from "../../backend/services/bookService";
import { prisma } from "../../backend/lib/prisma";

async function createOwner() {
  const uniqueEmail = `owner-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}@example.com`;
  return prisma.user.create({
    data: {
      email: uniqueEmail,
      name: "Book Owner",
      passwordHash: await bcrypt.hash("password123", 10)
    }
  });
}

describe("bookService", () => {
  it("creates and lists books", async () => {
    const owner = await createOwner();
    const created = await createBook({
      title: "Test Book",
      author: "Test Author",
      description: "A book created in tests.",
      owner: { connect: { id: owner.id } }
    });

    expect(created.title).toBe("Test Book");

    const books = await listBooks();
    expect(books).toHaveLength(1);
    expect(books[0]?.owner.email).toContain("@example.com");
  });

  it("deletes a book", async () => {
    const owner = await createOwner();
    const created = await createBook({
      title: "Delete Me",
      author: "Test",
      owner: { connect: { id: owner.id } }
    });

    await deleteBook(created.id);

    const fetched = await getBook(created.id);
    expect(fetched).toBeNull();
  });
});

