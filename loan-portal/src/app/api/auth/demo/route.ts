import { NextRequest, NextResponse } from "next/server";
import { signToken } from "@/lib/auth";
import { isDemoModeEnabled } from "@/lib/demo-mode";
import { getDemoUserByRole, type DemoRole } from "@/lib/demo-store";

const allowedRoles: DemoRole[] = ["BORROWER", "BROKER", "ADMIN"];

export async function POST(req: NextRequest) {
  if (!isDemoModeEnabled()) {
    return NextResponse.json({ error: "Demo access is only available for local testing" }, { status: 403 });
  }

  const { role } = (await req.json()) as { role?: DemoRole };
  if (!role || !allowedRoles.includes(role)) {
    return NextResponse.json({ error: "Invalid demo role" }, { status: 400 });
  }

  const user = getDemoUserByRole(role);
  if (!user) {
    return NextResponse.json({ error: "Demo user not found" }, { status: 404 });
  }

  const token = signToken({ userId: user.id, email: user.email, role: user.role });
  const response = NextResponse.json({ user });
  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return response;
}
