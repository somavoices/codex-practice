import { getServerSession } from "next-auth";
import { authOptions } from "@/backend/auth/options";
import { NavbarClient } from "./NavbarClient";

export async function Navbar() {
  const session = await getServerSession(authOptions);
  return <NavbarClient session={session} />;
}
