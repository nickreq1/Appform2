"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/applications/new", label: "New Application" },
    ...(user?.role === "ADMIN" ? [{ href: "/admin", label: "Admin Panel" }] : []),
  ];

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="text-xl font-bold text-blue-700">
              Equity One Portal
            </Link>
            <div className="hidden md:flex space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:text-blue-700 hover:bg-gray-50"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {user && (
              <>
                <span className="text-sm text-gray-600">
                  {user.firstName} {user.lastName}
                  <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    {user.role}
                  </span>
                </span>
                <button
                  onClick={logout}
                  className="text-sm text-gray-600 hover:text-red-600 transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
