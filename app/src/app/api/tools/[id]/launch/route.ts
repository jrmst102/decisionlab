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

  // Only append SSO token for internal tools that support it
  const SSO_ENABLED_SLUGS = new Set(["negotiation-sim", "scenario-sim"]);

  let launchUrl: string;
  if (SSO_ENABLED_SLUGS.has(tool.slug)) {
    const url = new URL(tool.url);
    url.pathname = "/auth/sso";
    url.searchParams.set("token", ssoToken);
    launchUrl = url.toString();
  } else {
    launchUrl = tool.url;
  }

  return NextResponse.json({
    launchUrl,
    authMethod: tool.authMethod,
    toolUrl: tool.url,
  });
}
