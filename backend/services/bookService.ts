import { prisma } from "../lib/prisma";
import type { Prisma } from "@prisma/client";

export async function listBooks() {
  return prisma.book.findMany({
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });
}

export async function getBook(id: string) {
  return prisma.book.findUnique({
    where: { id },
    include: {
      owner: {
        select: {
          id: true,
          name: true
        }
      },
      borrowRequests: {
        include: {
          requester: {
            select: { id: true, name: true, email: true }
          }
        },
        orderBy: { createdAt: "desc" }
      }
    }
  });
}

export async function createBook(data: Prisma.BookCreateInput) {
  return prisma.book.create({ data });
}

export async function updateBook(
  id: string,
  data: Prisma.BookUpdateInput
) {
  return prisma.book.update({
    where: { id },
    data
  });
}

export async function deleteBook(id: string) {
  return prisma.book.delete({
    where: { id }
  });
}
