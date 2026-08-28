"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

interface Application {
  id: string;
  status: string;
  borrowerFirstName: string;
  borrowerLastName: string;
  borrowerEmail: string;
  loanAmount: number | null;
  loanPurpose: string | null;
  createdAt: string;
  submittedAt: string | null;
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

const STATUSES = ["", "DRAFT", "SUBMITTED", "UNDER_REVIEW", "APPROVED", "DECLINED", "MORE_INFO_NEEDED"];

export default function AdminPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const limit = 20;

  const fetch_apps = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status) params.set("status", status);
    if (search) params.set("search", search);
    const res = await fetch(`/api/admin/applications?${params}`);
    if (res.ok) {
      const data = await res.json();
      setApplications(data.applications);
      setTotal(data.total);
    }
    setLoading(false);
  }, [page, status, search]);

  useEffect(() => { fetch_apps(); }, [fetch_apps]);

  function exportCSV() {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    window.open(`/api/admin/applications/export?${params}`, "_blank");
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-500 mt-1">{total} total applications</p>
        </div>
        <button onClick={exportCSV}
          className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors text-sm">
          Export CSV
        </button>
      </div>

      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          {STATUSES.map((s) => <option key={s} value={s}>{s || "All Statuses"}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {["Borrower", "Submitted By", "Loan Details", "Status", "Date", ""].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Loading...</td></tr>
            ) : applications.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No applications found</td></tr>
            ) : applications.map((app) => (
              <tr key={app.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-800">{app.borrowerFirstName} {app.borrowerLastName}</p>
                  <p className="text-gray-500 text-xs">{app.borrowerEmail}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-gray-700">{app.user.firstName} {app.user.lastName}</p>
                  <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{app.user.role}</span>
                </td>
                <td className="px-4 py-3">
                  <p className="text-gray-700">{app.loanPurpose || "—"}</p>
                  <p className="text-gray-500 text-xs">{app.loanAmount ? `$${app.loanAmount.toLocaleString()}` : "—"}</p>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[app.status]}`}>
                    {app.status.replace(/_/g, " ")}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">
                  {new Date(app.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <Link href={`/applications/${app.id}`} className="text-blue-600 hover:underline text-xs">
                    View →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between items-center px-4 py-3 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Showing {Math.min((page - 1) * limit + 1, total)}–{Math.min(page * limit, total)} of {total}
          </p>
          <div className="flex gap-2">
            <button onClick={() => setPage((p) => p - 1)} disabled={page === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50">
              Previous
            </button>
            <button onClick={() => setPage((p) => p + 1)} disabled={page * limit >= total}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
