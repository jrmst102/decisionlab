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

  // Append SSO token to the tool URL so the receiving app can auto-authenticate
  const launchUrl = new URL(tool.url);
  launchUrl.pathname = "/auth/sso";
  launchUrl.searchParams.set("token", ssoToken);

  return NextResponse.json({
    launchUrl: launchUrl.toString(),
    authMethod: tool.authMethod,
    toolUrl: tool.url,
  });
}
