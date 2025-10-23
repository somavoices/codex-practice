import { NextResponse } from "next/server";
import { authOptions } from "@/backend/auth/options";
import { getServerSession } from "next-auth";
import { updateUser, deleteUser } from "@/backend/services/userService";

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { id } = await context.params;

  if (session.user.id !== id) {
    return NextResponse.json(
      { error: "You can only update your own profile" },
      { status: 403 }
    );
  }

  const updated = await updateUser(id, {
    name: body.name,
    email: body.email
  });

  return NextResponse.json({
    id: updated.id,
    email: updated.email,
    name: updated.name
  });
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

  if (session.user.id !== id) {
    return NextResponse.json(
      { error: "You can only delete your own profile" },
      { status: 403 }
    );
  }

  await deleteUser(id);
  return NextResponse.json({ success: true });
}
