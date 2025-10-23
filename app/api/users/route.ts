import { NextResponse } from "next/server";
import { listUsers, createUser } from "@/backend/services/userService";
import { authOptions } from "@/backend/auth/options";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  const body = await request.json();
  const email = String(body.email ?? "").trim().toLowerCase();
  const name = String(body.name ?? "").trim();
  const password = String(body.password ?? "");

  if (!email || !name || password.length < 8) {
    return NextResponse.json(
      { error: "Name, email, and password (min 8 chars) are required" },
      { status: 400 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await createUser({ email, name, passwordHash });

  return NextResponse.json(
    { id: user.id, email: user.email, name: user.name },
    { status: 201 }
  );
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await listUsers();
  return NextResponse.json(users);
}
