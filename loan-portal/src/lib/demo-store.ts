import { v4 as uuidv4 } from "uuid";

export type DemoRole = "BORROWER" | "BROKER" | "ADMIN";
export type DemoStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "DECLINED"
  | "MORE_INFO_NEEDED";

export interface DemoPayload {
  userId: string;
  email: string;
  role: string;
}

export interface DemoUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: DemoRole;
  createdAt: Date;
}

interface DemoFile {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  storagePath: string;
  uploadedAt: Date;
}

interface DemoHistory {
  id: string;
  status: DemoStatus;
  note: string | null;
  changedAt: Date;
}

interface DemoApplication {
  id: string;
  userId: string;
  status: DemoStatus;
  borrowerFirstName: string;
  borrowerLastName: string;
  borrowerEmail: string;
  borrowerPhone: string;
  borrowerDOB: string | null;
  borrowerAddress: string | null;
  borrowerCity: string | null;
  borrowerState: string | null;
  borrowerPostcode: string | null;
  employmentStatus: string | null;
  employerName: string | null;
  jobTitle: string | null;
  yearsEmployed: number | null;
  annualIncome: number | null;
  loanPurpose: string | null;
  loanAmount: number | null;
  loanTerm: number | null;
  interestType: string | null;
  propertyAddress: string | null;
  propertyCity: string | null;
  propertyState: string | null;
  propertyPostcode: string | null;
  propertyValue: number | null;
  propertyType: string | null;
  savingsAmount: number | null;
  otherAssets: string | null;
  existingDebts: string | null;
  monthlyExpenses: number | null;
  additionalNotes: string | null;
  submittedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  files: DemoFile[];
  statusHistory: DemoHistory[];
}

const DEMO_USERS: DemoUser[] = [
  {
    id: "demo-borrower",
    email: "demo.borrower@example.com",
    firstName: "Demo",
    lastName: "Borrower",
    phone: "0400 111 222",
    role: "BORROWER",
    createdAt: new Date("2026-01-15T09:00:00Z"),
  },
  {
    id: "demo-broker",
    email: "demo.broker@example.com",
    firstName: "Demo",
    lastName: "Broker",
    phone: "0400 333 444",
    role: "BROKER",
    createdAt: new Date("2026-01-20T09:00:00Z"),
  },
  {
    id: "demo-admin",
    email: "demo.admin@example.com",
    firstName: "Demo",
    lastName: "Admin",
    phone: "0400 555 666",
    role: "ADMIN",
    createdAt: new Date("2026-01-25T09:00:00Z"),
  },
];

const applications: DemoApplication[] = [
  {
    id: "demo-app-1",
    userId: "demo-borrower",
    status: "DRAFT",
    borrowerFirstName: "Demo",
    borrowerLastName: "Borrower",
    borrowerEmail: "demo.borrower@example.com",
    borrowerPhone: "0400 111 222",
    borrowerDOB: "1990-03-12",
    borrowerAddress: "12 Harbour Street",
    borrowerCity: "Sydney",
    borrowerState: "NSW",
    borrowerPostcode: "2000",
    employmentStatus: "FULL_TIME",
    employerName: "Acme Finance",
    jobTitle: "Analyst",
    yearsEmployed: 4,
    annualIncome: 95000,
    loanPurpose: "PURCHASE",
    loanAmount: 650000,
    loanTerm: 30,
    interestType: "VARIABLE",
    propertyAddress: "45 Beach Road",
    propertyCity: "Manly",
    propertyState: "NSW",
    propertyPostcode: "2095",
    propertyValue: 880000,
    propertyType: "HOUSE",
    savingsAmount: 125000,
    otherAssets: "Car and ETF portfolio",
    existingDebts: "Credit card balance of 2500",
    monthlyExpenses: 3200,
    additionalNotes: "Testing the portal flow locally.",
    submittedAt: null,
    createdAt: new Date("2026-08-01T09:00:00Z"),
    updatedAt: new Date("2026-08-01T09:00:00Z"),
    files: [],
    statusHistory: [],
  },
  {
    id: "demo-app-2",
    userId: "demo-broker",
    status: "UNDER_REVIEW",
    borrowerFirstName: "Taylor",
    borrowerLastName: "Applicant",
    borrowerEmail: "taylor@example.com",
    borrowerPhone: "0400 987 654",
    borrowerDOB: "1987-07-01",
    borrowerAddress: "8 Collins Street",
    borrowerCity: "Melbourne",
    borrowerState: "VIC",
    borrowerPostcode: "3000",
    employmentStatus: "SELF_EMPLOYED",
    employerName: "Taylor Consulting",
    jobTitle: "Director",
    yearsEmployed: 6,
    annualIncome: 180000,
    loanPurpose: "REFINANCE",
    loanAmount: 720000,
    loanTerm: 25,
    interestType: "FIXED",
    propertyAddress: "88 Chapel Street",
    propertyCity: "Prahran",
    propertyState: "VIC",
    propertyPostcode: "3181",
    propertyValue: 1100000,
    propertyType: "TOWNHOUSE",
    savingsAmount: 210000,
    otherAssets: "Investment unit",
    existingDebts: "Mortgage and car loan",
    monthlyExpenses: 4700,
    additionalNotes: "Requested quick turnaround.",
    submittedAt: new Date("2026-08-03T11:30:00Z"),
    createdAt: new Date("2026-08-03T11:00:00Z"),
    updatedAt: new Date("2026-08-05T08:30:00Z"),
    files: [
      {
        id: "demo-file-1",
        fileName: "payslips.pdf",
        fileType: "application/pdf",
        fileSize: 240000,
        storagePath: "demo://payslips.pdf",
        uploadedAt: new Date("2026-08-03T11:15:00Z"),
      },
    ],
    statusHistory: [
      {
        id: "demo-history-1",
        status: "SUBMITTED",
        note: "Application submitted",
        changedAt: new Date("2026-08-03T11:30:00Z"),
      },
      {
        id: "demo-history-2",
        status: "UNDER_REVIEW",
        note: "Broker started review",
        changedAt: new Date("2026-08-05T08:30:00Z"),
      },
    ],
  },
];

function parseNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseInteger(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const parsed = parseInt(String(value), 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function getUserById(userId: string) {
  return DEMO_USERS.find((user) => user.id === userId) || null;
}

function withUser(application: DemoApplication) {
  const user = getUserById(application.userId);
  return {
    ...application,
    user: {
      firstName: user?.firstName || "Demo",
      lastName: user?.lastName || "User",
      email: user?.email || "demo@example.com",
      role: user?.role || "BORROWER",
    },
  };
}

function ensureAuthorizedApplication(payload: DemoPayload, id: string) {
  const application = applications.find((entry) => entry.id === id) || null;
  if (!application) return null;
  if (payload.role !== "ADMIN" && application.userId !== payload.userId) return false;
  return application;
}

export function listDemoUsers() {
  return DEMO_USERS.map(({ id, email, firstName, lastName, role }) => ({
    id,
    email,
    firstName,
    lastName,
    role,
  }));
}

export function getDemoUser(userId: string) {
  return getUserById(userId);
}

export function getDemoUserByRole(role: DemoRole) {
  return DEMO_USERS.find((user) => user.role === role) || null;
}

export function listDemoApplicationsForDashboard(payload: DemoPayload, page: number, limit: number) {
  const filtered = (payload.role === "ADMIN"
    ? applications
    : applications.filter((application) => application.userId === payload.userId)
  ).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const start = (page - 1) * limit;
  return {
    applications: filtered.slice(start, start + limit).map(withUser),
    total: filtered.length,
    page,
    limit,
  };
}

export function listDemoApplicationsForAdmin(page: number, limit: number, status: string | null, search: string | null) {
  let filtered = [...applications];
  if (status) filtered = filtered.filter((application) => application.status === status);
  if (search) {
    const query = search.toLowerCase();
    filtered = filtered.filter((application) =>
      [application.borrowerFirstName, application.borrowerLastName, application.borrowerEmail]
        .some((value) => value.toLowerCase().includes(query))
    );
  }

  filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  const start = (page - 1) * limit;
  return {
    applications: filtered.slice(start, start + limit).map(withUser),
    total: filtered.length,
    page,
    limit,
  };
}

export function listDemoApplicationsForExport(status: string | null) {
  const filtered = status
    ? applications.filter((application) => application.status === status)
    : [...applications];

  return filtered
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .map(withUser);
}

export function getDemoApplication(payload: DemoPayload, id: string) {
  const application = ensureAuthorizedApplication(payload, id);
  if (application === false) return false;
  if (!application) return null;
  return withUser(application);
}

export function createDemoApplication(payload: DemoPayload, body: Record<string, unknown>) {
  const user = getUserById(payload.userId);
  if (!user) return null;

  const submit = body.submit === true;
  const now = new Date();

  const application: DemoApplication = {
    id: uuidv4(),
    userId: payload.userId,
    status: submit ? "SUBMITTED" : "DRAFT",
    borrowerFirstName: String(body.borrowerFirstName || ""),
    borrowerLastName: String(body.borrowerLastName || ""),
    borrowerEmail: String(body.borrowerEmail || payload.email),
    borrowerPhone: String(body.borrowerPhone || ""),
    borrowerDOB: body.borrowerDOB ? String(body.borrowerDOB) : null,
    borrowerAddress: body.borrowerAddress ? String(body.borrowerAddress) : null,
    borrowerCity: body.borrowerCity ? String(body.borrowerCity) : null,
    borrowerState: body.borrowerState ? String(body.borrowerState) : null,
    borrowerPostcode: body.borrowerPostcode ? String(body.borrowerPostcode) : null,
    employmentStatus: body.employmentStatus ? String(body.employmentStatus) : null,
    employerName: body.employerName ? String(body.employerName) : null,
    jobTitle: body.jobTitle ? String(body.jobTitle) : null,
    yearsEmployed: parseNumber(body.yearsEmployed),
    annualIncome: parseNumber(body.annualIncome),
    loanPurpose: body.loanPurpose ? String(body.loanPurpose) : null,
    loanAmount: parseNumber(body.loanAmount),
    loanTerm: parseInteger(body.loanTerm),
    interestType: body.interestType ? String(body.interestType) : null,
    propertyAddress: body.propertyAddress ? String(body.propertyAddress) : null,
    propertyCity: body.propertyCity ? String(body.propertyCity) : null,
    propertyState: body.propertyState ? String(body.propertyState) : null,
    propertyPostcode: body.propertyPostcode ? String(body.propertyPostcode) : null,
    propertyValue: parseNumber(body.propertyValue),
    propertyType: body.propertyType ? String(body.propertyType) : null,
    savingsAmount: parseNumber(body.savingsAmount),
    otherAssets: body.otherAssets ? String(body.otherAssets) : null,
    existingDebts: body.existingDebts ? String(body.existingDebts) : null,
    monthlyExpenses: parseNumber(body.monthlyExpenses),
    additionalNotes: body.additionalNotes ? String(body.additionalNotes) : null,
    submittedAt: submit ? now : null,
    createdAt: now,
    updatedAt: now,
    files: [],
    statusHistory: submit
      ? [{ id: uuidv4(), status: "SUBMITTED", note: "Application submitted", changedAt: now }]
      : [],
  };

  applications.unshift(application);
  return withUser(application);
}

export function updateDemoApplication(payload: DemoPayload, id: string, body: Record<string, unknown>) {
  const application = ensureAuthorizedApplication(payload, id);
  if (application === false) return false;
  if (!application) return null;

  const submit = body.submit === true;
  const shouldSubmit = submit && application.status === "DRAFT";

  application.borrowerFirstName = body.borrowerFirstName !== undefined ? String(body.borrowerFirstName || "") : application.borrowerFirstName;
  application.borrowerLastName = body.borrowerLastName !== undefined ? String(body.borrowerLastName || "") : application.borrowerLastName;
  application.borrowerEmail = body.borrowerEmail !== undefined ? String(body.borrowerEmail || payload.email) : application.borrowerEmail;
  application.borrowerPhone = body.borrowerPhone !== undefined ? String(body.borrowerPhone || "") : application.borrowerPhone;
  application.borrowerDOB = body.borrowerDOB !== undefined ? (body.borrowerDOB ? String(body.borrowerDOB) : null) : application.borrowerDOB;
  application.borrowerAddress = body.borrowerAddress !== undefined ? (body.borrowerAddress ? String(body.borrowerAddress) : null) : application.borrowerAddress;
  application.borrowerCity = body.borrowerCity !== undefined ? (body.borrowerCity ? String(body.borrowerCity) : null) : application.borrowerCity;
  application.borrowerState = body.borrowerState !== undefined ? (body.borrowerState ? String(body.borrowerState) : null) : application.borrowerState;
  application.borrowerPostcode = body.borrowerPostcode !== undefined ? (body.borrowerPostcode ? String(body.borrowerPostcode) : null) : application.borrowerPostcode;
  application.employmentStatus = body.employmentStatus !== undefined ? (body.employmentStatus ? String(body.employmentStatus) : null) : application.employmentStatus;
  application.employerName = body.employerName !== undefined ? (body.employerName ? String(body.employerName) : null) : application.employerName;
  application.jobTitle = body.jobTitle !== undefined ? (body.jobTitle ? String(body.jobTitle) : null) : application.jobTitle;
  application.yearsEmployed = body.yearsEmployed !== undefined ? parseNumber(body.yearsEmployed) : application.yearsEmployed;
  application.annualIncome = body.annualIncome !== undefined ? parseNumber(body.annualIncome) : application.annualIncome;
  application.loanPurpose = body.loanPurpose !== undefined ? (body.loanPurpose ? String(body.loanPurpose) : null) : application.loanPurpose;
  application.loanAmount = body.loanAmount !== undefined ? parseNumber(body.loanAmount) : application.loanAmount;
  application.loanTerm = body.loanTerm !== undefined ? parseInteger(body.loanTerm) : application.loanTerm;
  application.interestType = body.interestType !== undefined ? (body.interestType ? String(body.interestType) : null) : application.interestType;
  application.propertyAddress = body.propertyAddress !== undefined ? (body.propertyAddress ? String(body.propertyAddress) : null) : application.propertyAddress;
  application.propertyCity = body.propertyCity !== undefined ? (body.propertyCity ? String(body.propertyCity) : null) : application.propertyCity;
  application.propertyState = body.propertyState !== undefined ? (body.propertyState ? String(body.propertyState) : null) : application.propertyState;
  application.propertyPostcode = body.propertyPostcode !== undefined ? (body.propertyPostcode ? String(body.propertyPostcode) : null) : application.propertyPostcode;
  application.propertyValue = body.propertyValue !== undefined ? parseNumber(body.propertyValue) : application.propertyValue;
  application.propertyType = body.propertyType !== undefined ? (body.propertyType ? String(body.propertyType) : null) : application.propertyType;
  application.savingsAmount = body.savingsAmount !== undefined ? parseNumber(body.savingsAmount) : application.savingsAmount;
  application.otherAssets = body.otherAssets !== undefined ? (body.otherAssets ? String(body.otherAssets) : null) : application.otherAssets;
  application.existingDebts = body.existingDebts !== undefined ? (body.existingDebts ? String(body.existingDebts) : null) : application.existingDebts;
  application.monthlyExpenses = body.monthlyExpenses !== undefined ? parseNumber(body.monthlyExpenses) : application.monthlyExpenses;
  application.additionalNotes = body.additionalNotes !== undefined ? (body.additionalNotes ? String(body.additionalNotes) : null) : application.additionalNotes;
  application.updatedAt = new Date();

  if (shouldSubmit) {
    application.status = "SUBMITTED";
    application.submittedAt = new Date();
    application.statusHistory.unshift({
      id: uuidv4(),
      status: "SUBMITTED",
      note: "Application submitted",
      changedAt: application.submittedAt,
    });
  }

  return withUser(application);
}

export function deleteDemoApplication(payload: DemoPayload, id: string) {
  const application = ensureAuthorizedApplication(payload, id);
  if (application === false) return false;
  if (!application) return null;
  if (application.status !== "DRAFT") return "Only draft applications can be deleted";

  const index = applications.findIndex((entry) => entry.id === id);
  if (index >= 0) applications.splice(index, 1);
  return true;
}

export function updateDemoApplicationStatus(payload: DemoPayload, id: string, status: DemoStatus, note: string | null) {
  if (payload.role !== "ADMIN" && payload.role !== "BROKER") return false;
  const application = applications.find((entry) => entry.id === id) || null;
  if (!application) return null;

  application.status = status;
  application.updatedAt = new Date();
  application.statusHistory.unshift({
    id: uuidv4(),
    status,
    note,
    changedAt: new Date(),
  });

  return withUser(application);
}

export function addDemoFile(payload: DemoPayload, id: string, file: File) {
  const application = ensureAuthorizedApplication(payload, id);
  if (application === false) return false;
  if (!application) return null;

  const dbFile: DemoFile = {
    id: uuidv4(),
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
    storagePath: `demo://${id}/${file.name}`,
    uploadedAt: new Date(),
  };

  application.files.unshift(dbFile);
  application.updatedAt = new Date();
  return dbFile;
}
