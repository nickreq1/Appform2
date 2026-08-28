import { NextRequest, NextResponse } from "next/server";
import { isDemoModeEnabled } from "@/lib/demo-mode";
import { listDemoApplicationsForExport } from "@/lib/demo-store";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const payload = await getCurrentUser();
  if (!payload || payload.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const where: Record<string, unknown> = {};
  if (status) where.status = status;

  const applications = isDemoModeEnabled()
    ? listDemoApplicationsForExport(status)
    : await prisma.application.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { email: true, role: true } } },
      });

  const headers = [
    "ID", "Status", "Borrower Name", "Borrower Email", "Loan Amount", "Loan Purpose",
    "Property Value", "Annual Income", "Submitted At", "Created At", "Submitted By Role",
  ];

  const rows = applications.map((a: (typeof applications)[number]) => [
    a.id,
    a.status,
    `${a.borrowerFirstName} ${a.borrowerLastName}`,
    a.borrowerEmail,
    a.loanAmount ?? "",
    a.loanPurpose ?? "",
    a.propertyValue ?? "",
    a.annualIncome ?? "",
    a.submittedAt?.toISOString() ?? "",
    a.createdAt.toISOString(),
    a.user.role,
  ]);

  const csv = [headers, ...rows]
    .map((r) => r.map((v: string | number) => `"${String(v).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="applications-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
