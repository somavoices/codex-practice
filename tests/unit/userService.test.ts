import { describe, expect, it } from "vitest";
import bcrypt from "bcryptjs";
import {
  createUser,
  listUsers,
  updateUser,
  deleteUser
} from "../../backend/services/userService";
import { prisma } from "../../backend/lib/prisma";

describe("userService", () => {
  it("creates and lists users", async () => {
    const passwordHash = await bcrypt.hash("secret123", 10);
    const created = await createUser({
      email: "reader@example.com",
      name: "Test Reader",
      passwordHash
    });

    expect(created.email).toBe("reader@example.com");

    const users = await listUsers();
    expect(users).toHaveLength(1);
    expect(users[0]?.email).toBe("reader@example.com");
  });

  it("updates user profile data", async () => {
    const passwordHash = await bcrypt.hash("secret123", 10);
    const created = await createUser({
      email: "update@example.com",
      name: "Update User",
      passwordHash
    });

    const updated = await updateUser(created.id, {
      name: "Updated Name",
      email: "new-email@example.com"
    });

    expect(updated.name).toBe("Updated Name");
    expect(updated.email).toBe("new-email@example.com");
  });

  it("deletes users", async () => {
    const passwordHash = await bcrypt.hash("secret123", 10);
    const created = await createUser({
      email: "remove@example.com",
      name: "Remove Me",
      passwordHash
    });

    await deleteUser(created.id);

    const dbUser = await prisma.user.findUnique({
      where: { id: created.id }
    });
    expect(dbUser).toBeNull();
  });
});
