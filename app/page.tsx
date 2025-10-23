import { Navbar } from "@/components/Navbar";
import { BookCard } from "@/components/BookCard";
import { BorrowButton } from "@/components/BorrowButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/backend/auth/options";
import { listBooks } from "@/backend/services/bookService";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import AutoStoriesRoundedIcon from "@mui/icons-material/AutoStoriesRounded";

export default async function HomePage() {
  const [books, session] = await Promise.all([
    listBooks(),
    getServerSession(authOptions)
  ]);

  return (
    <Stack minHeight="100vh" sx={{ bgcolor: "transparent" }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Stack spacing={2.5} sx={{ mb: 5, maxWidth: 680 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <AutoStoriesRoundedIcon color="primary" fontSize="large" />
            <Typography variant="h4" fontWeight={700} color="text.primary">
              Borrow and share books in your neighbourhood
            </Typography>
          </Stack>
          <Typography variant="body1" color="text.secondary">
            Discover community favourites, request a read, or add your own gems to grow our
            offline-first library.
          </Typography>
        </Stack>

        <Stack spacing={3}>
          {books.length === 0 && (
            <Paper
              variant="outlined"
              sx={{
                p: 4,
                borderStyle: "dashed",
                borderColor: "rgba(124,77,255,0.35)",
                bgcolor: "rgba(124,77,255,0.06)"
              }}
            >
              <Typography variant="body1" color="text.secondary">
                No books shared yet. Sign in and add the first title to inspire the community.
              </Typography>
            </Paper>
          )}

          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              actionSlot={
                session?.user && book.ownerId !== session.user.id ? (
                  <BorrowButton bookId={book.id} />
                ) : undefined
              }
            />
          ))}
        </Stack>
      </Container>
    </Stack>
  );
}
