"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";

interface FormData {
  // Personal
  borrowerFirstName: string;
  borrowerLastName: string;
  borrowerEmail: string;
  borrowerPhone: string;
  borrowerDOB: string;
  borrowerAddress: string;
  borrowerCity: string;
  borrowerState: string;
  borrowerPostcode: string;
  // Employment
  employmentStatus: string;
  employerName: string;
  jobTitle: string;
  yearsEmployed: string;
  annualIncome: string;
  // Loan
  loanPurpose: string;
  loanAmount: string;
  loanTerm: string;
  interestType: string;
  // Property
  propertyAddress: string;
  propertyCity: string;
  propertyState: string;
  propertyPostcode: string;
  propertyValue: string;
  propertyType: string;
  // Assets
  savingsAmount: string;
  otherAssets: string;
  existingDebts: string;
  monthlyExpenses: string;
  // Notes
  additionalNotes: string;
}

const STEPS = ["Personal Info", "Employment", "Loan Details", "Property", "Assets & Liabilities", "Review"];

const INITIAL: FormData = {
  borrowerFirstName: "", borrowerLastName: "", borrowerEmail: "", borrowerPhone: "",
  borrowerDOB: "", borrowerAddress: "", borrowerCity: "", borrowerState: "", borrowerPostcode: "",
  employmentStatus: "", employerName: "", jobTitle: "", yearsEmployed: "", annualIncome: "",
  loanPurpose: "", loanAmount: "", loanTerm: "", interestType: "",
  propertyAddress: "", propertyCity: "", propertyState: "", propertyPostcode: "", propertyValue: "", propertyType: "",
  savingsAmount: "", otherAssets: "", existingDebts: "", monthlyExpenses: "",
  additionalNotes: "",
};

function Field({ label, name, value, onChange, type = "text", required = false, placeholder = "" }:
  { label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    type?: string; required?: boolean; placeholder?: string; }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input name={name} type={type} value={value} onChange={onChange} required={required} placeholder={placeholder}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>
  );
}

function SelectField({ label, name, value, onChange, options, required = false }:
  { label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: { value: string; label: string }[]; required?: boolean }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <select name={name} value={value} onChange={onChange} required={required}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option value="">Select...</option>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

export default function NewApplicationPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function save(submit: boolean) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, submit }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      router.push(`/applications/${data.application.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error saving application");
    } finally {
      setLoading(false);
    }
  }

  const australianStates = [
    { value: "NSW", label: "New South Wales" }, { value: "VIC", label: "Victoria" },
    { value: "QLD", label: "Queensland" }, { value: "WA", label: "Western Australia" },
    { value: "SA", label: "South Australia" }, { value: "TAS", label: "Tasmania" },
    { value: "ACT", label: "Australian Capital Territory" }, { value: "NT", label: "Northern Territory" },
  ];

  const renderStep = () => {
    switch (step) {
      case 0: return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="First Name" name="borrowerFirstName" value={form.borrowerFirstName} onChange={handleChange} required />
            <Field label="Last Name" name="borrowerLastName" value={form.borrowerLastName} onChange={handleChange} required />
          </div>
          <Field label="Email" name="borrowerEmail" value={form.borrowerEmail} onChange={handleChange} type="email" required />
          <Field label="Phone" name="borrowerPhone" value={form.borrowerPhone} onChange={handleChange} type="tel" required />
          <Field label="Date of Birth" name="borrowerDOB" value={form.borrowerDOB} onChange={handleChange} type="date" />
          <Field label="Street Address" name="borrowerAddress" value={form.borrowerAddress} onChange={handleChange} />
          <div className="grid grid-cols-3 gap-4">
            <Field label="City/Suburb" name="borrowerCity" value={form.borrowerCity} onChange={handleChange} />
            <SelectField label="State" name="borrowerState" value={form.borrowerState} onChange={handleChange} options={australianStates} />
            <Field label="Postcode" name="borrowerPostcode" value={form.borrowerPostcode} onChange={handleChange} />
          </div>
        </div>
      );
      case 1: return (
        <div className="space-y-4">
          <SelectField label="Employment Status" name="employmentStatus" value={form.employmentStatus} onChange={handleChange} required
            options={[
              { value: "FULL_TIME", label: "Full Time" }, { value: "PART_TIME", label: "Part Time" },
              { value: "SELF_EMPLOYED", label: "Self Employed" }, { value: "CASUAL", label: "Casual" },
              { value: "CONTRACT", label: "Contract" }, { value: "RETIRED", label: "Retired" },
              { value: "UNEMPLOYED", label: "Unemployed" },
            ]} />
          <Field label="Employer Name" name="employerName" value={form.employerName} onChange={handleChange} />
          <Field label="Job Title" name="jobTitle" value={form.jobTitle} onChange={handleChange} />
          <Field label="Years with Current Employer" name="yearsEmployed" value={form.yearsEmployed} onChange={handleChange} type="number" />
          <Field label="Annual Income (AUD)" name="annualIncome" value={form.annualIncome} onChange={handleChange} type="number" placeholder="e.g. 80000" />
        </div>
      );
      case 2: return (
        <div className="space-y-4">
          <SelectField label="Loan Purpose" name="loanPurpose" value={form.loanPurpose} onChange={handleChange} required
            options={[
              { value: "PURCHASE", label: "Purchase" }, { value: "REFINANCE", label: "Refinance" },
              { value: "CONSTRUCTION", label: "Construction" }, { value: "INVESTMENT", label: "Investment" },
              { value: "EQUITY_RELEASE", label: "Equity Release" }, { value: "OTHER", label: "Other" },
            ]} />
          <Field label="Loan Amount (AUD)" name="loanAmount" value={form.loanAmount} onChange={handleChange} type="number" required placeholder="e.g. 500000" />
          <SelectField label="Loan Term (years)" name="loanTerm" value={form.loanTerm} onChange={handleChange}
            options={[5, 10, 15, 20, 25, 30].map((y) => ({ value: String(y), label: `${y} years` }))} />
          <SelectField label="Interest Type" name="interestType" value={form.interestType} onChange={handleChange}
            options={[
              { value: "VARIABLE", label: "Variable" }, { value: "FIXED", label: "Fixed" },
              { value: "SPLIT", label: "Split" },
            ]} />
        </div>
      );
      case 3: return (
        <div className="space-y-4">
          <SelectField label="Property Type" name="propertyType" value={form.propertyType} onChange={handleChange}
            options={[
              { value: "HOUSE", label: "House" }, { value: "UNIT", label: "Unit/Apartment" },
              { value: "TOWNHOUSE", label: "Townhouse" }, { value: "LAND", label: "Land" },
              { value: "COMMERCIAL", label: "Commercial" }, { value: "OTHER", label: "Other" },
            ]} />
          <Field label="Property Address" name="propertyAddress" value={form.propertyAddress} onChange={handleChange} />
          <div className="grid grid-cols-3 gap-4">
            <Field label="City/Suburb" name="propertyCity" value={form.propertyCity} onChange={handleChange} />
            <SelectField label="State" name="propertyState" value={form.propertyState} onChange={handleChange} options={australianStates} />
            <Field label="Postcode" name="propertyPostcode" value={form.propertyPostcode} onChange={handleChange} />
          </div>
          <Field label="Estimated Property Value (AUD)" name="propertyValue" value={form.propertyValue} onChange={handleChange} type="number" />
        </div>
      );
      case 4: return (
        <div className="space-y-4">
          <Field label="Savings / Cash (AUD)" name="savingsAmount" value={form.savingsAmount} onChange={handleChange} type="number" />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Other Assets</label>
            <textarea name="otherAssets" value={form.otherAssets} onChange={handleChange} rows={3}
              placeholder="e.g. Vehicles, investments, other properties..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Existing Debts / Liabilities</label>
            <textarea name="existingDebts" value={form.existingDebts} onChange={handleChange} rows={3}
              placeholder="e.g. Credit cards, personal loans, other mortgages..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <Field label="Monthly Living Expenses (AUD)" name="monthlyExpenses" value={form.monthlyExpenses} onChange={handleChange} type="number" />
        </div>
      );
      case 5: return (
        <div className="space-y-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-3">Application Summary</h3>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <dt className="text-gray-500">Borrower</dt>
              <dd className="font-medium">{form.borrowerFirstName} {form.borrowerLastName}</dd>
              <dt className="text-gray-500">Email</dt>
              <dd className="font-medium">{form.borrowerEmail}</dd>
              <dt className="text-gray-500">Loan Purpose</dt>
              <dd className="font-medium">{form.loanPurpose || "—"}</dd>
              <dt className="text-gray-500">Loan Amount</dt>
              <dd className="font-medium">{form.loanAmount ? `$${parseFloat(form.loanAmount).toLocaleString()}` : "—"}</dd>
              <dt className="text-gray-500">Property Value</dt>
              <dd className="font-medium">{form.propertyValue ? `$${parseFloat(form.propertyValue).toLocaleString()}` : "—"}</dd>
              <dt className="text-gray-500">Annual Income</dt>
              <dd className="font-medium">{form.annualIncome ? `$${parseFloat(form.annualIncome).toLocaleString()}` : "—"}</dd>
            </dl>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
            <textarea name="additionalNotes" value={form.additionalNotes} onChange={handleChange} rows={4}
              placeholder="Any additional information..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">New Loan Application</h1>

        {/* Stepper */}
        <div className="flex items-center mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 ${
                i < step ? "bg-blue-600 text-white" : i === step ? "bg-blue-600 text-white ring-4 ring-blue-100" : "bg-gray-200 text-gray-500"
              }`}>
                {i < step ? "✓" : i + 1}
              </div>
              <div className="ml-1 mr-1">
                <p className={`text-xs font-medium ${i <= step ? "text-blue-600" : "text-gray-400"}`}>{s}</p>
              </div>
              {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${i < step ? "bg-blue-600" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-5">{STEPS[step]}</h2>
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
          {renderStep()}
          <div className="flex justify-between mt-8 pt-4 border-t border-gray-100">
            <button onClick={() => setStep((s) => s - 1)} disabled={step === 0}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors">
              Previous
            </button>
            <div className="flex gap-3">
              <button onClick={() => save(false)} disabled={loading}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors">
                Save Draft
              </button>
              {step < STEPS.length - 1 ? (
                <button onClick={() => setStep((s) => s + 1)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Next
                </button>
              ) : (
                <button onClick={() => save(true)} disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors">
                  {loading ? "Submitting..." : "Submit Application"}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
