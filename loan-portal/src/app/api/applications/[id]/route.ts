import { NextRequest, NextResponse } from "next/server";
import { isDemoModeEnabled } from "@/lib/demo-mode";
import { deleteDemoApplication, getDemoApplication, updateDemoApplication } from "@/lib/demo-store";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const payload = await getCurrentUser();
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  if (isDemoModeEnabled()) {
    const application = getDemoApplication(payload, id);
    if (application === false) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    if (!application) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ application });
  }

  const application = await prisma.application.findUnique({
    where: { id },
    include: {
      user: { select: { firstName: true, lastName: true, email: true, role: true } },
      files: true,
      statusHistory: { orderBy: { changedAt: "desc" } },
    },
  });

  if (!application) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (payload.role !== "ADMIN" && application.userId !== payload.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({ application });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const payload = await getCurrentUser();
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { submit, ...data } = body;

  if (isDemoModeEnabled()) {
    const application = updateDemoApplication(payload, id, { ...data, submit });
    if (application === false) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    if (!application) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ application });
  }

  const existing = await prisma.application.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (payload.role !== "ADMIN" && existing.userId !== payload.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updateData: Record<string, unknown> = { ...data };
  if (submit && existing.status === "DRAFT") {
    updateData.status = "SUBMITTED";
    updateData.submittedAt = new Date();
  }

  const application = await prisma.application.update({
    where: { id },
    data: updateData,
  });

  if (submit && existing.status === "DRAFT") {
    await prisma.statusHistory.create({
      data: { applicationId: id, status: "SUBMITTED", note: "Application submitted" },
    });
  }

  return NextResponse.json({ application });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const payload = await getCurrentUser();
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  if (isDemoModeEnabled()) {
    const result = deleteDemoApplication(payload, id);
    if (result === false) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    if (result === null) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (typeof result === "string") return NextResponse.json({ error: result }, { status: 400 });
    return NextResponse.json({ success: true });
  }

  const existing = await prisma.application.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (payload.role !== "ADMIN" && existing.userId !== payload.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (existing.status !== "DRAFT") {
    return NextResponse.json({ error: "Only draft applications can be deleted" }, { status: 400 });
  }

  await prisma.application.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
