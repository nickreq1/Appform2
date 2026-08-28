import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const payload = await getCurrentUser();
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  const where = payload.role === "ADMIN" ? {} : { userId: payload.userId };

  const [applications, total] = await Promise.all([
    prisma.application.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: { user: { select: { firstName: true, lastName: true, email: true } } },
    }),
    prisma.application.count({ where }),
  ]);

  return NextResponse.json({ applications, total, page, limit });
}

export async function POST(req: NextRequest) {
  const payload = await getCurrentUser();
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { submit, ...data } = body;

  const application = await prisma.application.create({
    data: {
      userId: payload.userId,
      status: submit ? "SUBMITTED" : "DRAFT",
      submittedAt: submit ? new Date() : null,
      borrowerFirstName: data.borrowerFirstName || "",
      borrowerLastName: data.borrowerLastName || "",
      borrowerEmail: data.borrowerEmail || payload.email,
      borrowerPhone: data.borrowerPhone || "",
      borrowerDOB: data.borrowerDOB,
      borrowerAddress: data.borrowerAddress,
      borrowerCity: data.borrowerCity,
      borrowerState: data.borrowerState,
      borrowerPostcode: data.borrowerPostcode,
      employmentStatus: data.employmentStatus,
      employerName: data.employerName,
      jobTitle: data.jobTitle,
      yearsEmployed: data.yearsEmployed ? parseFloat(data.yearsEmployed) : null,
      annualIncome: data.annualIncome ? parseFloat(data.annualIncome) : null,
      loanPurpose: data.loanPurpose,
      loanAmount: data.loanAmount ? parseFloat(data.loanAmount) : null,
      loanTerm: data.loanTerm ? parseInt(data.loanTerm) : null,
      interestType: data.interestType,
      propertyAddress: data.propertyAddress,
      propertyCity: data.propertyCity,
      propertyState: data.propertyState,
      propertyPostcode: data.propertyPostcode,
      propertyValue: data.propertyValue ? parseFloat(data.propertyValue) : null,
      propertyType: data.propertyType,
      savingsAmount: data.savingsAmount ? parseFloat(data.savingsAmount) : null,
      otherAssets: data.otherAssets,
      existingDebts: data.existingDebts,
      monthlyExpenses: data.monthlyExpenses ? parseFloat(data.monthlyExpenses) : null,
      additionalNotes: data.additionalNotes,
    },
  });

  if (submit) {
    await prisma.statusHistory.create({
      data: { applicationId: application.id, status: "SUBMITTED", note: "Application submitted" },
    });
  }

  return NextResponse.json({ application }, { status: 201 });
}
