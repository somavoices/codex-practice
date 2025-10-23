"use client";

import { useState } from "react";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import BookmarkAddRoundedIcon from "@mui/icons-material/BookmarkAddRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { useRouter } from "next/navigation";

type Props = {
  bookId: string;
};

export function BorrowButton({ bookId }: Props) {
  const [isRequested, setIsRequested] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleBorrow() {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/borrow-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId }),
        credentials: "include"
      });
      if (res.status === 401) {
        const callbackUrl =
          typeof window !== "undefined" ? window.location.href : "/";
        router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
        return;
      }
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to request book");
      }
      setIsRequested(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Stack spacing={1} alignItems="flex-end">
      <Button
        variant={isRequested ? "outlined" : "contained"}
        color="secondary"
        endIcon={
          isRequested ? <CheckCircleRoundedIcon /> : <BookmarkAddRoundedIcon />
        }
        disabled={isRequested || isLoading}
        onClick={handleBorrow}
        size="small"
        data-testid="borrow-button"
      >
        {isRequested ? "Request sent" : isLoading ? "Requesting..." : "Borrow"}
      </Button>
      {error && (
        <Alert severity="error" variant="filled" sx={{ width: "100%" }}>
          {error}
        </Alert>
      )}
    </Stack>
  );
}
