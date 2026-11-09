import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShieldCheck, PieChart, TrendingUp, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f5f7f8] flex flex-col justify-between">
      {/* Navigation */}
      <header className="h-16 border-b border-[#e8edef] bg-white/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between">
          <Link href="/" prefetch={true} className="flex items-center gap-2.5">
            <Image
              src="/pennywise-brand.svg"
              alt="Pennywise Logo"
              width={36}
              height={36}
              priority
              className="rounded-xl shadow-md shadow-[#237a6126]"
            />
            <span className="font-extrabold text-xl text-[#202b37] tracking-tight font-sans">
              Pennywise
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              prefetch={true}
              className="px-4 py-2 text-xs font-bold text-[#47545e] hover:text-[#237a61] transition"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              prefetch={true}
              className="px-4 py-2 bg-[#237a61] hover:bg-[#1d6c55] text-white text-xs font-bold rounded-lg shadow-sm shadow-[#237a6120] transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-4 py-16 sm:py-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e6f3ed] text-[#237a61] text-xs font-bold mb-6">
          <Sparkles size={14} />
          <span>Full-Stack Personal Expense Manager</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-[#202b37] tracking-tight leading-tight mb-6">
          Take control of your spending with{' '}
          <span className="text-[#237a61]">clarity and precision.</span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#788591] mb-10">
          Pennywise empowers you to log expenses, categorize transactions, analyze
          cash flow in real time, and build healthy financial habits with zero hassle.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/dashboard"
            prefetch={true}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#237a61] hover:bg-[#1d6c55] text-white text-sm font-bold rounded-xl shadow-md shadow-[#237a6126] flex items-center justify-center gap-2 transition"
          >
            <span>Open Dashboard</span>
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/register"
            prefetch={true}
            className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-zinc-50 border border-[#e8edef] text-[#47545e] text-sm font-bold rounded-xl transition"
          >
            Create Free Account
          </Link>
        </div>

        {/* Dashboard Preview Graphic */}
        <div className="mt-12 flex justify-center">
          <Image
            src="/hero-preview.svg"
            alt="Pennywise Expense Tracker Dashboard Analytics Preview"
            width={600}
            height={340}
            priority
            className="rounded-2xl shadow-lg border border-[#e8edef] w-full max-w-2xl h-auto"
          />
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 text-left">
          <div className="p-6 bg-white border border-[#e8edef] rounded-2xl shadow-sm">
            <div className="h-10 w-10 rounded-xl bg-[#e6f3ed] text-[#237a61] flex items-center justify-center mb-4">
              <TrendingUp size={20} />
            </div>
            <h3 className="text-sm font-bold text-[#202b37] mb-1.5">
              Real-Time Tracking
            </h3>
            <p className="text-xs text-[#788591] leading-relaxed">
              Record expenses instantly with automatic totals, category tagging, and SWR live revalidation.
            </p>
          </div>

          <div className="p-6 bg-white border border-[#e8edef] rounded-2xl shadow-sm">
            <div className="h-10 w-10 rounded-xl bg-[#eaf0fb] text-[#4c74b9] flex items-center justify-center mb-4">
              <PieChart size={20} />
            </div>
            <h3 className="text-sm font-bold text-[#202b37] mb-1.5">
              Visual Analytics
            </h3>
            <p className="text-xs text-[#788591] leading-relaxed">
              Explore your spending breakdown with intuitive category distribution cards and monthly cashflow charts.
            </p>
          </div>

          <div className="p-6 bg-white border border-[#e8edef] rounded-2xl shadow-sm">
            <div className="h-10 w-10 rounded-xl bg-[#f0edfa] text-[#7967ae] flex items-center justify-center mb-4">
              <ShieldCheck size={20} />
            </div>
            <h3 className="text-sm font-bold text-[#202b37] mb-1.5">
              Secure Multi-Tenant Isolation
            </h3>
            <p className="text-xs text-[#788591] leading-relaxed">
              Every expense record is encrypted and strictly scoped to your private authenticated user session.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#e8edef] bg-white py-6">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#788591]">
          <p>© 2026 Pennywise Expense Manager. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/login" className="hover:text-[#237a61]">Sign In</Link>
            <Link href="/register" className="hover:text-[#237a61]">Register</Link>
            <Link href="/dashboard" className="hover:text-[#237a61]">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
