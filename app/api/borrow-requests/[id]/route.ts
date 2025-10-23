import { NextResponse } from "next/server";
import { authOptions } from "@/backend/auth/options";
import { getServerSession } from "next-auth";
import {
  updateBorrowRequestStatus,
  deleteBorrowRequest
} from "@/backend/services/borrowRequestService";
import {
  REQUEST_STATUSES,
  type RequestStatus
} from "@/backend/models/requestStatus";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const status = body.status as RequestStatus | undefined;
  if (!status || !REQUEST_STATUSES.includes(status)) {
    return NextResponse.json(
      { error: "Invalid status" },
      { status: 400 }
    );
  }

  const { id } = await context.params;
  const updated = await updateBorrowRequestStatus(id, status);
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
  await deleteBorrowRequest(id);
  return NextResponse.json({ success: true });
}
