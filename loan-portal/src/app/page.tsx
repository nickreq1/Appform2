import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold text-blue-800 mb-4">Equity One Loan Portal</h1>
        <p className="text-lg text-gray-600 mb-8">
          Secure loan application management for brokers and borrowers.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/auth/login"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/auth/register"
            className="px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          >
            Register
          </Link>
        </div>
      </div>
    </main>
  );
}
