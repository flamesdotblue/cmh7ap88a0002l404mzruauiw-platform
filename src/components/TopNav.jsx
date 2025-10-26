import { Building2, Settings, User } from 'lucide-react'

export default function TopNav() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow">
            <Building2 size={18} />
          </div>
          <span className="font-semibold tracking-tight">Partner Loans</span>
        </div>
        <nav className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-md border bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50">
            <Settings size={16} />
            Settings
          </button>
          <button className="inline-flex h-8 w-8 items-center justify-center rounded-full border bg-white text-slate-700 shadow-sm">
            <User size={16} />
          </button>
        </nav>
      </div>
    </header>
  )
}
