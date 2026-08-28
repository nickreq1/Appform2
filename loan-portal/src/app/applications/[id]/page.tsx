"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/contexts/AuthContext";

interface ApplicationDetail {
  id: string;
  status: string;
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
  propertyValue: number | null;
  propertyType: string | null;
  savingsAmount: number | null;
  otherAssets: string | null;
  existingDebts: string | null;
  monthlyExpenses: number | null;
  additionalNotes: string | null;
  createdAt: string;
  submittedAt: string | null;
  statusHistory: { status: string; note: string | null; changedAt: string }[];
  files: { id: string; fileName: string; fileType: string; fileSize: number; uploadedAt: string }[];
  user: { firstName: string; lastName: string; email: string; role: string };
}

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  SUBMITTED: "bg-blue-100 text-blue-700",
  UNDER_REVIEW: "bg-yellow-100 text-yellow-700",
  APPROVED: "bg-green-100 text-green-700",
  DECLINED: "bg-red-100 text-red-700",
  MORE_INFO_NEEDED: "bg-orange-100 text-orange-700",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-4">
      <h3 className="font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div>
      <dt className="text-xs text-gray-500 uppercase tracking-wide">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-gray-800">{value ?? "—"}</dd>
    </div>
  );
}

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [application, setApplication] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [statusNote, setStatusNote] = useState("");
  const [newStatus, setNewStatus] = useState("");

  const fetchApplication = useCallback(async () => {
    const res = await fetch(`/api/applications/${id}`);
    if (res.ok) {
      const data = await res.json();
      setApplication(data.application);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => { fetchApplication(); }, [fetchApplication]);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(`/api/applications/${id}/upload`, { method: "POST", body: fd });
    if (res.ok) fetchApplication();
    setUploading(false);
  }

  async function handleStatusUpdate() {
    if (!newStatus) return;
    const res = await fetch(`/api/applications/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus, note: statusNote }),
    });
    if (res.ok) {
      fetchApplication();
      setNewStatus("");
      setStatusNote("");
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this draft application?")) return;
    const res = await fetch(`/api/applications/${id}`, { method: "DELETE" });
    if (res.ok) router.push("/dashboard");
  }

  if (loading) return <div className="min-h-screen bg-gray-50"><Navigation /><div className="p-8 text-center text-gray-400">Loading...</div></div>;
  if (!application) return <div className="min-h-screen bg-gray-50"><Navigation /><div className="p-8 text-center text-red-500">Application not found</div></div>;

  const canManageStatus = user?.role === "ADMIN" || user?.role === "BROKER";

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-700 mb-2 flex items-center gap-1">
              ← Back
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              {application.borrowerFirstName} {application.borrowerLastName}
            </h1>
            <p className="text-sm text-gray-500 mt-1">Application #{application.id.slice(0, 8)}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-sm font-medium px-3 py-1 rounded-full ${STATUS_COLORS[application.status]}`}>
              {application.status.replace(/_/g, " ")}
            </span>
            {application.status === "DRAFT" && (
              <button onClick={handleDelete} className="text-sm text-red-600 hover:text-red-700 border border-red-200 px-3 py-1 rounded-lg">
                Delete Draft
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="col-span-2 space-y-4">
            <Section title="Personal Information">
              <dl className="grid grid-cols-2 gap-4">
                <Field label="Email" value={application.borrowerEmail} />
                <Field label="Phone" value={application.borrowerPhone} />
                <Field label="Date of Birth" value={application.borrowerDOB} />
                <Field label="Address" value={[application.borrowerAddress, application.borrowerCity, application.borrowerState, application.borrowerPostcode].filter(Boolean).join(", ")} />
              </dl>
            </Section>
            <Section title="Loan Details">
              <dl className="grid grid-cols-2 gap-4">
                <Field label="Purpose" value={application.loanPurpose} />
                <Field label="Amount" value={application.loanAmount ? `$${application.loanAmount.toLocaleString()}` : null} />
                <Field label="Term" value={application.loanTerm ? `${application.loanTerm} years` : null} />
                <Field label="Interest Type" value={application.interestType} />
              </dl>
            </Section>
            <Section title="Employment">
              <dl className="grid grid-cols-2 gap-4">
                <Field label="Status" value={application.employmentStatus} />
                <Field label="Employer" value={application.employerName} />
                <Field label="Job Title" value={application.jobTitle} />
                <Field label="Annual Income" value={application.annualIncome ? `$${application.annualIncome.toLocaleString()}` : null} />
              </dl>
            </Section>
            <Section title="Property">
              <dl className="grid grid-cols-2 gap-4">
                <Field label="Type" value={application.propertyType} />
                <Field label="Value" value={application.propertyValue ? `$${application.propertyValue.toLocaleString()}` : null} />
                <Field label="Address" value={[application.propertyAddress, application.propertyCity, application.propertyState].filter(Boolean).join(", ")} />
              </dl>
            </Section>
          </div>

          <div className="space-y-4">
            <Section title="Documents">
              <div className="space-y-2 mb-3">
                {application.files.map((f) => (
                  <div key={f.id} className="text-sm p-2 bg-gray-50 rounded flex items-center gap-2">
                    <span className="text-gray-400">📎</span>
                    <span className="truncate text-gray-700">{f.fileName}</span>
                  </div>
                ))}
                {application.files.length === 0 && <p className="text-sm text-gray-400">No documents</p>}
              </div>
              <label className="block">
                <span className="text-sm text-blue-600 hover:underline cursor-pointer">
                  {uploading ? "Uploading..." : "+ Upload document"}
                </span>
                <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" />
              </label>
            </Section>

            {canManageStatus && (
              <Section title="Update Status">
                <div className="space-y-2">
                  <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                    <option value="">Select status...</option>
                    {["UNDER_REVIEW", "APPROVED", "DECLINED", "MORE_INFO_NEEDED"].map((s) => (
                      <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                    ))}
                  </select>
                  <textarea value={statusNote} onChange={(e) => setStatusNote(e.target.value)} rows={2}
                    placeholder="Note (optional)"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                  <button onClick={handleStatusUpdate} disabled={!newStatus}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">
                    Update
                  </button>
                </div>
              </Section>
            )}

            <Section title="Status History">
              <div className="space-y-2">
                {application.statusHistory.map((h, i) => (
                  <div key={i} className="text-sm border-l-2 border-blue-200 pl-3">
                    <p className="font-medium text-gray-700">{h.status.replace(/_/g, " ")}</p>
                    {h.note && <p className="text-gray-500">{h.note}</p>}
                    <p className="text-xs text-gray-400">{new Date(h.changedAt).toLocaleString()}</p>
                  </div>
                ))}
                {application.statusHistory.length === 0 && <p className="text-sm text-gray-400">No history</p>}
              </div>
            </Section>
          </div>
        </div>
      </main>
    </div>
  );
}
