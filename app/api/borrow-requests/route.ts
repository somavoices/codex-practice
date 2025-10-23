import { NextResponse } from "next/server";
import { authOptions } from "@/backend/auth/options";
import { getServerSession } from "next-auth";
import {
  listBorrowRequests,
  createBorrowRequest
} from "@/backend/services/borrowRequestService";
import { prisma } from "@/backend/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET() {
  const requests = await listBorrowRequests();
  return NextResponse.json(requests);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const bookId = String(body.bookId ?? "");
  const message = body.message ? String(body.message) : undefined;

  if (!bookId) {
    return NextResponse.json(
      { error: "bookId is required" },
      { status: 400 }
    );
  }

  const book = await prisma.book.findUnique({
    where: { id: bookId },
    select: { ownerId: true }
  });

  if (!book) {
    return NextResponse.json(
      { error: "Book not found" },
      { status: 404 }
    );
  }

  if (book.ownerId === session.user.id) {
    return NextResponse.json(
      { error: "You already own this book" },
      { status: 400 }
    );
  }

  const existingRequest = await prisma.borrowRequest.findFirst({
    where: { userId: session.user.id, bookId }
  });

  if (existingRequest) {
    return NextResponse.json(
      { error: "You have already requested this book" },
      { status: 409 }
    );
  }

  try {
    const requestRecord = await createBorrowRequest({
      userId: session.user.id,
      bookId,
      message
    });

    return NextResponse.json(requestRecord, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2003") {
        return NextResponse.json(
          { error: "Unable to create request for this book" },
          { status: 400 }
        );
      }
    }

    console.error("Failed to create borrow request", error);
    return NextResponse.json(
      { error: "Failed to create borrow request" },
      { status: 500 }
    );
  }
}
