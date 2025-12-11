import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { Role, User } from "@prisma/client";
import { verifyToken } from "@/lib/auth";

export type AuthUser = Pick<
  User,
  "id" | "email" | "firstName" | "lastName" | "role"
>;

const AUTH_COOKIE_NAME = "apex_auth";

export function getAuthCookieName() {
  return AUTH_COOKIE_NAME;
}

export async function getUserFromRequest(req: NextRequest): Promise<AuthUser | null> {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
  });

  if (!user) return null;

  const { id, email, firstName, lastName, role } = user;
  return { id, email, firstName, lastName, role };
}

export async function requireUser(req: NextRequest): Promise<AuthUser> {
  const user = await getUserFromRequest(req);
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}

export async function requireRole(req: NextRequest, roles: Role[]): Promise<AuthUser> {
  const user = await requireUser(req);
  if (!roles.includes(user.role)) {
    throw new Error("FORBIDDEN");
  }
  return user;
}
