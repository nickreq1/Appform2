import { NextRequest, NextResponse } from "next/server";
import { isDemoModeEnabled } from "@/lib/demo-mode";
import { updateDemoApplicationStatus, type DemoStatus } from "@/lib/demo-store";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const payload = await getCurrentUser();
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (payload.role !== "ADMIN" && payload.role !== "BROKER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const { status, note } = await req.json();

  const validStatuses = ["DRAFT", "SUBMITTED", "UNDER_REVIEW", "APPROVED", "DECLINED", "MORE_INFO_NEEDED"];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  if (isDemoModeEnabled()) {
    const application = updateDemoApplicationStatus(payload, id, status as DemoStatus, note || null);
    if (application === false) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    if (!application) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ application });
  }

  const application = await prisma.application.update({
    where: { id },
    data: { status },
  });

  await prisma.statusHistory.create({
    data: { applicationId: id, status, note },
  });

  return NextResponse.json({ application });
}
