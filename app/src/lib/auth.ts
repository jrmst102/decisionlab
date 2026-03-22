import { cookies } from "next/headers";
import prisma from "./prisma";
import bcryptjs from "bcryptjs";

// Re-export all edge-compatible auth functions
export {
  createAccessToken,
  createRefreshToken,
  verifyToken,
  createToolSSOToken,
} from "./auth-edge";
export type { TokenPayload } from "./auth-edge";

export async function hashPassword(password: string): Promise<string> {
  return bcryptjs.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcryptjs.compare(password, hash);
}

export async function getSession() {
  const { verifyToken } = await import("./auth-edge");
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function getSessionUser() {
  const session = await getSession();
  if (!session) return null;
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      isActive: true,
    },
  });
  if (!user || !user.isActive) return null;
  return user;
}
