"use client";

import { signOut } from "next-auth/react";
import Button from "@mui/material/Button";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

export function SignOutButton() {
  return (
    <Button
      variant="contained"
      color="secondary"
      size="small"
      startIcon={<LogoutRoundedIcon />}
      onClick={() => signOut({ callbackUrl: "/" })}
      sx={{ fontWeight: 600 }}
    >
      Sign out
    </Button>
  );
}
