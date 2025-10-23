import { prisma } from "../lib/prisma";
import type { Prisma } from "@prisma/client";

export async function listUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true
    }
  });
}

export async function createUser(data: {
  email: string;
  name: string;
  passwordHash: string;
}) {
  return prisma.user.create({
    data
  });
}

export async function updateUser(
  id: string,
  data: Prisma.UserUpdateInput
) {
  return prisma.user.update({
    where: { id },
    data
  });
}

export async function deleteUser(id: string) {
  return prisma.user.delete({
    where: { id }
  });
}
