"use client";

import { useState } from "react";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import type { BorrowRequest, Book, User } from "@prisma/client";
import type { RequestStatus } from "@/backend/models/requestStatus";
import { BorrowRequestList } from "./BorrowRequestList";

type RequestItem = BorrowRequest & {
  requester: Pick<User, "id" | "name" | "email">;
  book: Pick<Book, "id" | "title" | "ownerId">;
};

type Props = {
  initialRequests: RequestItem[];
};

export function ManageRequests({ initialRequests }: Props) {
  const [requests, setRequests] = useState(initialRequests);
  const [error, setError] = useState<string | null>(null);

  async function handleStatusChange(
    requestId: string,
    status: RequestStatus
  ) {
    try {
      setError(null);
      const res = await fetch(`/api/borrow-requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
        credentials: "include"
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to update status");
      }
      const updated = await res.json();
      setRequests((prev) =>
        prev.map((req) => (req.id === requestId ? { ...req, ...updated } : req))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }

  return (
    <Stack spacing={2}>
      <BorrowRequestList
        requests={requests}
        onStatusChange={handleStatusChange}
      />
      {error && (
        <Alert severity="error" variant="filled">
          {error}
        </Alert>
      )}
    </Stack>
  );
}
