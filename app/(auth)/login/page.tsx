"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setIsLoading(true);
    setError(null);

    const res = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false
    });

    setIsLoading(false);

    if (res?.error) {
      setError("Invalid credentials");
      return;
    }

    router.push(params.get("callbackUrl") ?? "/");
  }

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 4, md: 5 },
          borderRadius: 4,
          width: "100%",
          border: "1px solid rgba(124,77,255,0.18)",
          backdropFilter: "blur(14px)"
        }}
      >
        <Stack spacing={3} component="form" onSubmit={handleSubmit}>
          <Stack spacing={1}>
            <Typography variant="h4" fontWeight={700}>
              Welcome back
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sign in to borrow books and keep track of your requests.
            </Typography>
          </Stack>

          <Stack spacing={2}>
            <TextField
              label="Email address"
              name="email"
              type="email"
              required
              fullWidth
              autoComplete="email"
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              required
              fullWidth
              autoComplete="current-password"
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
            size="large"
            startIcon={<LoginRoundedIcon />}
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>

          <Typography variant="body2" color="text.secondary" textAlign="center">
            New here?{" "}
            <Button component={Link} href="/register" variant="text">
              Create an account
            </Button>
          </Typography>
        </Stack>
      </Paper>
    </Container>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <Stack
          height="100vh"
          alignItems="center"
          justifyContent="center"
          spacing={2}
          color="text.secondary"
        >
          <CircularProgress color="primary" />
          <Typography>Loading your library…</Typography>
        </Stack>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
