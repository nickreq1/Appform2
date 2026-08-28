"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

interface Application {
  id: string;
  status: string;
  borrowerFirstName: string;
  borrowerLastName: string;
  loanAmount: number | null;
  loanPurpose: string | null;
  createdAt: string;
  submittedAt: string | null;
  user?: { firstName: string; lastName: string; email: string };
}

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  SUBMITTED: "bg-blue-100 text-blue-700",
  UNDER_REVIEW: "bg-yellow-100 text-yellow-700",
  APPROVED: "bg-green-100 text-green-700",
  DECLINED: "bg-red-100 text-red-700",
  MORE_INFO_NEEDED: "bg-orange-100 text-orange-700",
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchApplications() {
      const res = await fetch("/api/applications");
      if (res.ok) {
        const data = await res.json();
        setApplications(data.applications);
        setTotal(data.total);
      }
      setLoading(false);
    }
    fetchApplications();
  }, []);

  const stats = {
    total,
    draft: applications.filter((a) => a.status === "DRAFT").length,
    submitted: applications.filter((a) => a.status === "SUBMITTED").length,
    approved: applications.filter((a) => a.status === "APPROVED").length,
  };

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-500 mt-1">Manage your loan applications</p>
        </div>
        <Link
          href="/applications/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          + New Application
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total", value: stats.total, color: "text-gray-700" },
          { label: "Draft", value: stats.draft, color: "text-gray-500" },
          { label: "Submitted", value: stats.submitted, color: "text-blue-600" },
          { label: "Approved", value: stats.approved, color: "text-green-600" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className={`text-3xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Recent Applications</h2>
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : applications.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            No applications yet.{" "}
            <Link href="/applications/new" className="text-blue-600 hover:underline">
              Create your first application
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {applications.map((app) => (
              <Link key={app.id} href={`/applications/${app.id}`} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div>
                  <p className="font-medium text-gray-800">
                    {app.borrowerFirstName} {app.borrowerLastName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {app.loanPurpose || "—"} · {app.loanAmount ? `$${app.loanAmount.toLocaleString()}` : "Amount TBD"}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[app.status] || "bg-gray-100 text-gray-700"}`}>
                  {app.status.replace(/_/g, " ")}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
