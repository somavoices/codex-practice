import { getServerSession } from "next-auth";
import { authOptions } from "@/backend/auth/options";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { BookForm } from "@/components/BookForm";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AutoFixHighRoundedIcon from "@mui/icons-material/AutoFixHighRounded";

export default async function NewBookPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <Stack minHeight="100vh">
      <Navbar />
      <Container maxWidth="md" sx={{ py: { xs: 5, md: 8 } }}>
        <Stack spacing={1.5} sx={{ mb: 4 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <AutoFixHighRoundedIcon color="primary" fontSize="large" />
            <Typography variant="h4" fontWeight={700}>
              Share a new book
            </Typography>
          </Stack>
          <Typography variant="body1" color="text.secondary">
            Add the essentials so neighbours can discover and request your read.
          </Typography>
        </Stack>
        <BookForm action="create" />
      </Container>
    </Stack>
  );
}
