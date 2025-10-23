"use client";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Link from "next/link";
import { SignOutButton } from "./SignOutButton";
import type { Session } from "next-auth";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";

type Props = {
  session: Session | null;
};

export function NavbarClient({ session }: Props) {
  const initials = session?.user?.name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{ background: "rgba(255, 255, 255, 0.8)", backdropFilter: "blur(12px)" }}
    >
      <Toolbar sx={{ maxWidth: "1080px", width: "100%", mx: "auto", py: 1.5 }}>
        <Typography
          variant="h6"
          component={Link}
          href="/"
          sx={{
            flexGrow: 1,
            fontWeight: 700,
            color: "primary.main",
            textDecoration: "none"
          }}
        >
          Share-A-Book
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <Button component={Link} href="/" variant="text" color="inherit">
            Books
          </Button>
          <Button component={Link} href="/dashboard" variant="text" color="inherit">
            Dashboard
          </Button>
          {session?.user ? (
            <>
              <Chip
                color="primary"
                variant="outlined"
                avatar={
                  <Avatar>
                    {initials || (session.user.email?.[0]?.toUpperCase() ?? "U")}
                  </Avatar>
                }
                label={`Hi, ${session.user.name ?? "Reader"}`}
              />
              <SignOutButton />
            </>
          ) : (
            <Button component={Link} href="/login" variant="contained" color="primary">
              Sign in
            </Button>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
