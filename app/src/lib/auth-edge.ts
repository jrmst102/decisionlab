import { SignJWT, jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "change-me-in-production-please"
);
const ACCESS_TOKEN_EXPIRY = "8h";
const REFRESH_TOKEN_EXPIRY = "7d";

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
}

export async function createAccessToken(payload: TokenPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRY)
    .sign(SECRET);
}

export async function createRefreshToken(payload: TokenPayload): Promise<string> {
  return new SignJWT({ userId: payload.userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_EXPIRY)
    .sign(SECRET);
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as TokenPayload;
  } catch {
    return null;
  }
}

export async function createToolSSOToken(
  userId: string,
  email: string,
  role: string,
  toolSlug: string
): Promise<string> {
  // Check for a tool-specific secret first (e.g. TOOL_SSO_SECRET_SCENARIO_SIM),
  // then fall back to the shared TOOL_SSO_SECRET.
  const envKey = `TOOL_SSO_SECRET_${toolSlug.toUpperCase().replace(/-/g, "_")}`;
  const secret = process.env[envKey] || process.env.TOOL_SSO_SECRET || "tool-sso-secret-change-me";
  const TOOL_SECRET = new TextEncoder().encode(secret);
  return new SignJWT({ userId, email, role, tool: toolSlug })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(TOOL_SECRET);
}
