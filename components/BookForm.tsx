"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";

type Props = {
  action: "create" | "update";
  bookId?: string;
  defaults?: {
    title?: string;
    author?: string;
    description?: string | null;
  };
};

export function BookForm({ action, bookId, defaults }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);

    try {
      const endpoint =
        action === "create" ? "/api/books" : `/api/books/${bookId}`;
      const method = action === "create" ? "POST" : "PUT";

      const res = await fetch(endpoint, {
        method,
        body:
          method === "POST"
            ? formData
            : JSON.stringify({
                title: formData.get("title"),
                author: formData.get("author"),
                description: formData.get("description")
              }),
        headers:
          method === "POST"
            ? undefined
            : { "Content-Type": "application/json" },
        credentials: "include"
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to save book");
      }

      router.refresh();
      router.push("/dashboard");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        border: "1px solid rgba(124,77,255,0.15)",
        backdropFilter: "blur(16px)"
      }}
    >
      <CardContent>
        <Stack
          component="form"
          spacing={3}
          onSubmit={handleSubmit}
          sx={{ "& .MuiTypography-subtitle2": { fontWeight: 600 } }}
        >
          <Stack spacing={1.5}>
            <Typography variant="subtitle2" color="text.secondary">
              Book title
            </Typography>
            <TextField
              label="Book title"
              id="title"
              name="title"
              placeholder="e.g. The Library of Babel"
              defaultValue={defaults?.title ?? ""}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Stack>

          <Stack spacing={1.5}>
            <Typography variant="subtitle2" color="text.secondary">
              Author
            </Typography>
            <TextField
              label="Author"
              id="author"
              name="author"
              placeholder="e.g. Jorge Luis Borges"
              defaultValue={defaults?.author ?? ""}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Stack>

          {action === "create" && (
            <Stack spacing={1.5}>
              <Typography variant="subtitle2" color="text.secondary">
                Cover image
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                component="label"
                startIcon={<CloudUploadRoundedIcon />}
                sx={{ alignSelf: { xs: "stretch", sm: "flex-start" } }}
              >
                {fileName ?? "Upload cover"}
                <input
                  hidden
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    setFileName(file ? file.name : null);
                  }}
                />
              </Button>
              <Typography variant="caption" color="text.secondary">
                Images are stored locally in <code>/public/uploads</code> so your library
                works offline.
              </Typography>
            </Stack>
          )}

          <Stack spacing={1.5}>
            <Typography variant="subtitle2" color="text.secondary">
              Description
            </Typography>
            <TextField
              label="Description"
              id="description"
              name="description"
              placeholder="What makes this book worth sharing?"
              defaultValue={defaults?.description ?? ""}
              multiline
              minRows={4}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Stack>

          {error && (
            <Alert severity="error" variant="filled">
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            startIcon={<SaveRoundedIcon />}
            disabled={isSubmitting}
            sx={{ alignSelf: { xs: "stretch", sm: "flex-start" } }}
          >
            {isSubmitting
              ? "Saving..."
              : action === "create"
              ? "Share this book"
              : "Save changes"}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
