import { SignJWT, jwtVerify, importPKCS8 } from "jose";

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
  toolSlug: string,
  firstName?: string,
  lastName?: string
): Promise<string> {
  const envPrefix = toolSlug.toUpperCase().replace(/-/g, "_");

  // Check for an RSA private key first (RS256 asymmetric signing).
  // Env var format: PKCS#8 PEM (-----BEGIN PRIVATE KEY-----) with literal \n separators.
  // e.g. TOOL_SSO_PRIVATE_KEY_AHP_STUDIO
  // NOTE: Must be PKCS#8 format. Convert PKCS#1 keys with:
  //   openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt -in key.pem
  const privateKeyPem = process.env[`TOOL_SSO_PRIVATE_KEY_${envPrefix}`];

  if (privateKeyPem) {
    const pem = privateKeyPem.replace(/\\n/g, "\n");
    const privateKey = await importPKCS8(pem, "RS256");
    return new SignJWT({ userId, email, role, tool: toolSlug, firstName, lastName })
      .setProtectedHeader({ alg: "RS256" })
      .setIssuedAt()
      .setExpirationTime("5m")
      .sign(privateKey);
  }

  // Fall back to HS256 shared secret (existing tools).
  const secret = process.env[`TOOL_SSO_SECRET_${envPrefix}`]
    || process.env.TOOL_SSO_SECRET
    || "tool-sso-secret-change-me";
  const TOOL_SECRET = new TextEncoder().encode(secret);
  return new SignJWT({ userId, email, role, tool: toolSlug, firstName, lastName })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(TOOL_SECRET);
}
