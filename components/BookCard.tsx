import type { Book, User } from "@prisma/client";
import Image from "next/image";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";

type BookWithOwner = Book & {
  owner: Pick<User, "id" | "name" | "email">;
};

type Props = {
  book: BookWithOwner;
  actionSlot?: React.ReactNode;
};

export function BookCard({ book, actionSlot }: Props) {
  return (
    <Card
      data-testid="book-card"
      data-book-id={book.id}
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        gap: 3,
        borderRadius: 3,
        border: "1px solid rgba(124,77,255,0.15)",
        "&:hover": {
          borderColor: "primary.main",
          boxShadow: "0 14px 30px rgba(124,77,255,0.15)"
        }
      }}
    >
      <Box
        sx={{
          width: 120,
          position: "relative",
          borderRadius: 2,
          overflow: "hidden",
          bgcolor: "rgba(124,77,255,0.08)",
          alignSelf: "center",
          mt: { xs: 3, sm: 0 },
          ml: { xs: 3, sm: 3 }
        }}
      >
        {book.imagePath ? (
          <Box sx={{ position: "relative", width: "100%", height: 160 }}>
            <Image
              src={book.imagePath}
              alt={book.title}
              fill
              style={{ objectFit: "cover" }}
            />
          </Box>
        ) : (
          <Stack
            height={160}
            alignItems="center"
            justifyContent="center"
            sx={{ color: "primary.main", fontSize: 12, fontWeight: 600 }}
          >
            No cover yet
          </Stack>
        )}
      </Box>
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
        >
          <Stack spacing={1}>
            <Typography variant="h6" color="text.primary">
              {book.title}
            </Typography>
            <Typography variant="subtitle1">by {book.author}</Typography>
          </Stack>
          <Chip
            label={book.available ? "Available" : "Borrowed"}
            color={book.available ? "success" : "warning"}
            variant={book.available ? "filled" : "outlined"}
          />
        </Stack>
        {book.description && (
          <>
            <Divider sx={{ mt: 2, mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              {book.description}
            </Typography>
          </>
        )}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
          sx={{ mt: 3 }}
        >
          <Typography variant="caption" color="text.secondary">
            Shared by <strong>{book.owner.name ?? book.owner.email}</strong>
          </Typography>
          {actionSlot}
        </Stack>
      </CardContent>
    </Card>
  );
}
