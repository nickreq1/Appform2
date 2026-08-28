import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { isDemoModeEnabled } from "@/lib/demo-mode";
import { getDemoUser } from "@/lib/demo-store";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const payload = await getCurrentUser();
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (isDemoModeEnabled()) {
    const user = getDemoUser(payload.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, email: true, firstName: true, lastName: true, phone: true, role: true, createdAt: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ user });
}
