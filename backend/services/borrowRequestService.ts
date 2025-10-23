import { prisma } from "../lib/prisma";
import type { RequestStatus } from "../models/requestStatus";
import { REQUEST_STATUSES } from "../models/requestStatus";

export async function listBorrowRequests() {
  return prisma.borrowRequest.findMany({
    include: {
      requester: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      book: {
        select: {
          id: true,
          title: true,
          ownerId: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });
}

export async function createBorrowRequest(data: {
  userId: string;
  bookId: string;
  message?: string;
}) {
  return prisma.borrowRequest.create({
    data
  });
}

export async function updateBorrowRequestStatus(
  id: string,
  status: RequestStatus
) {
  if (!REQUEST_STATUSES.includes(status)) {
    throw new Error("Invalid status");
  }
  return prisma.borrowRequest.update({
    where: { id },
    data: { status }
  });
}

export async function deleteBorrowRequest(id: string) {
  return prisma.borrowRequest.delete({
    where: { id }
  });
}
