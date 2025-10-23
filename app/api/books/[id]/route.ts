import { NextResponse } from "next/server";
import { authOptions } from "@/backend/auth/options";
import { getServerSession } from "next-auth";
import {
  getBook,
  updateBook,
  deleteBook
} from "@/backend/services/bookService";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const book = await getBook(id);
  if (!book) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(book);
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const existing = await getBook(id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (existing.ownerId !== session.user.id) {
    return NextResponse.json(
      { error: "Only the owner can update this book" },
      { status: 403 }
    );
  }

  const body = await request.json();
  const data = {
    title: body.title ?? existing.title,
    author: body.author ?? existing.author,
    description: body.description ?? existing.description,
    available:
      typeof body.available === "boolean" ? body.available : existing.available
  };

  const updated = await updateBook(id, data);
  return NextResponse.json(updated);
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const existing = await getBook(id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (existing.ownerId !== session.user.id) {
    return NextResponse.json(
      { error: "Only the owner can delete this book" },
      { status: 403 }
    );
  }

  await deleteBook(id);
  return NextResponse.json({ success: true });
}
