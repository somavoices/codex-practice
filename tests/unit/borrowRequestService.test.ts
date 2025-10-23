import { describe, expect, it } from "vitest";
import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import {
  createBorrowRequest,
  listBorrowRequests,
  updateBorrowRequestStatus,
  deleteBorrowRequest
} from "../../backend/services/borrowRequestService";
import { prisma } from "../../backend/lib/prisma";
import type { RequestStatus } from "../../backend/models/requestStatus";

function uniqueEmail(prefix: string) {
  return `${prefix}-${randomUUID()}@example.com`;
}

async function createBorrower() {
  return prisma.user.create({
    data: {
      email: uniqueEmail("borrower"),
      name: "Borrower",
      passwordHash: await bcrypt.hash("password123", 10)
    }
  });
}

async function createBookWithOwner(title: string) {
  return prisma.book.create({
    data: {
      title,
      author: "Author",
      owner: {
        create: {
          email: uniqueEmail("owner"),
          name: "Owner",
          passwordHash: await bcrypt.hash("password123", 10)
        }
      }
    }
  });
}

describe("borrowRequestService", () => {
  it("updates a borrow request status", async () => {
    const borrower = await createBorrower();
    const book = await createBookWithOwner("Status Book");

    const request = await createBorrowRequest({
      bookId: book.id,
      userId: borrower.id
    });

    const updated = await updateBorrowRequestStatus(
      request.id,
      "APPROVED" as RequestStatus
    );

    expect(updated.status).toBe("APPROVED");
  });

  it("deletes a borrow request", async () => {
    const borrower = await createBorrower();
    const book = await createBookWithOwner("Delete Request");

    const request = await createBorrowRequest({
      bookId: book.id,
      userId: borrower.id
    });

    await deleteBorrowRequest(request.id);

    const requests = await listBorrowRequests();
    expect(requests).toHaveLength(0);
  });
});
