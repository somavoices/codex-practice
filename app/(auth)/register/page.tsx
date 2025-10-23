"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      name: form.get("name"),
      email: form.get("email"),
      password: form.get("password")
    };

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to register");
      }

      await signIn("credentials", {
        email: payload.email,
        password: payload.password,
        redirect: false
      });

      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
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
              Create your library card
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Join the neighbourhood exchange and start sharing your shelves.
            </Typography>
          </Stack>

          <Stack spacing={2}>
            <TextField label="Name" name="name" type="text" required fullWidth />
            <TextField label="Email address" name="email" type="email" required fullWidth />
            <TextField
              label="Password"
              name="password"
              type="password"
              required
              fullWidth
              inputProps={{ minLength: 8 }}
              helperText="Use at least 8 characters"
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
            startIcon={<PersonAddRoundedIcon />}
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Create account"}
          </Button>

          <Typography variant="body2" color="text.secondary" textAlign="center">
            Already registered?{" "}
            <Button component={Link} href="/login" variant="text">
              Sign in
            </Button>
          </Typography>
        </Stack>
      </Paper>
    </Container>
  );
}
