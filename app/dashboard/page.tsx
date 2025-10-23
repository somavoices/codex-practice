import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/backend/auth/options";
import { prisma } from "@/backend/lib/prisma";
import { Navbar } from "@/components/Navbar";
import { BookCard } from "@/components/BookCard";
import { ManageRequests } from "@/components/ManageRequests";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const [books, borrowRequests] = await Promise.all([
    prisma.book.findMany({
      where: { ownerId: session.user.id },
      include: {
        owner: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: "desc" }
    }),
    prisma.borrowRequest.findMany({
      where: { book: { ownerId: session.user.id } },
      include: {
        requester: {
          select: { id: true, name: true, email: true }
        },
        book: {
          select: { id: true, title: true, ownerId: true }
        }
      },
      orderBy: { createdAt: "desc" }
    })
  ]);

  return (
    <Stack minHeight="100vh">
      <Navbar />
      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          spacing={3}
          sx={{ mb: 6 }}
        >
          <div>
            <Typography variant="h4" fontWeight={700}>
              Your shared library
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Keep your shelf updated and respond to readers in just a few taps.
            </Typography>
          </div>
          <Button
            component={Link}
            href="/dashboard/new-book"
            variant="contained"
            startIcon={<AddCircleRoundedIcon />}
            size="large"
            color="primary"
          >
            Add a new book
          </Button>
        </Stack>

        <Stack spacing={5}>
          <Stack spacing={2}>
            <Typography variant="h6" fontWeight={600}>
              Books you share
            </Typography>
            {books.length === 0 ? (
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
                  You haven&apos;t shared any books yet. Add a favourite title to kick things off.
                </Typography>
              </Paper>
            ) : (
              <Stack spacing={3}>
                {books.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </Stack>
            )}
          </Stack>

          <Stack spacing={2}>
            <Typography variant="h6" fontWeight={600}>
              Borrow requests
            </Typography>
            <ManageRequests initialRequests={borrowRequests} />
          </Stack>
        </Stack>
      </Container>
    </Stack>
  );
}
