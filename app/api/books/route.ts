import { NextResponse } from "next/server";
import { authOptions } from "@/backend/auth/options";
import { getServerSession } from "next-auth";
import { listBooks, createBook } from "@/backend/services/bookService";
import { saveFileFromBuffer } from "@/backend/lib/uploads";

export const runtime = "nodejs";

export async function GET() {
  const books = await listBooks();
  return NextResponse.json(books);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const contentType = request.headers.get("content-type") ?? "";
  let imagePath: string | undefined;
  let payload: Record<string, unknown>;

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const file = formData.get("image");
    if (file && file instanceof File && file.size > 0) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const extension = file.name.split(".").pop() ?? "jpg";
      imagePath = await saveFileFromBuffer(buffer, extension);
    }
    payload = {
      title: formData.get("title"),
      author: formData.get("author"),
      description: formData.get("description")
    };
  } else {
    payload = await request.json();
  }

  const title = String(payload.title ?? "").trim();
  const author = String(payload.author ?? "").trim();
  const description = payload.description
    ? String(payload.description)
    : undefined;

  if (!title || !author) {
    return NextResponse.json(
      { error: "Title and author are required" },
      { status: 400 }
    );
  }

  const book = await createBook({
    title,
    author,
    description,
    imagePath,
    owner: {
      connect: { id: session.user.id }
    }
  });

  return NextResponse.json(book, { status: 201 });
}
