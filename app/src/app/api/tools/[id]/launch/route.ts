import { NextRequest, NextResponse } from "next/server";
import { getSession, createToolSSOToken } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const tool = await prisma.tool.findUnique({ where: { id } });
  if (!tool || !tool.isActive) {
    return NextResponse.json({ error: "Tool not found" }, { status: 404 });
  }

  const ssoToken = await createToolSSOToken(
    session.userId,
    session.email,
    session.role,
    tool.slug
  );

  // Build launch URL based on auth method
  let launchUrl = tool.url;
  if (tool.authMethod === "REDIRECT" || tool.authMethod === "JWT_EXCHANGE") {
    const separator = tool.url.includes("?") ? "&" : "?";
    launchUrl = `${tool.url}${separator}sso_token=${ssoToken}`;
  }

  return NextResponse.json({
    launchUrl,
    ssoToken,
    authMethod: tool.authMethod,
    toolUrl: tool.url,
  });
}
