import { Calendar, Filter, Search, X } from 'lucide-react'

export default function FiltersBar({
  search,
  setSearch,
  status,
  setStatus,
  partner,
  setPartner,
  partners,
  statuses,
  dateFrom,
  dateTo,
  setDateFrom,
  setDateTo,
  onReset,
}) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ID, applicant, partner, product"
            className="w-full rounded-md border px-8 py-2 text-sm outline-none ring-0 transition placeholder:text-slate-400 focus:border-slate-300 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full rounded-md border bg-white px-3 py-2 text-sm focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={partner}
          onChange={(e) => setPartner(e.target.value)}
          className="w-full rounded-md border bg-white px-3 py-2 text-sm focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
        >
          {partners.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <div className="flex gap-2">
          <div className="relative w-full">
            <Calendar className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full rounded-md border px-8 py-2 text-sm outline-none ring-0 transition focus:border-slate-300 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div className="relative w-full">
            <Calendar className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full rounded-md border px-8 py-2 text-sm outline-none ring-0 transition focus:border-slate-300 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-md border bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <X size={16} /> Reset
        </button>
        <div className="hidden items-center gap-2 rounded-md border bg-white px-3 py-2 text-sm text-slate-600 md:inline-flex">
          <Filter size={16} />
          Filters active
        </div>
      </div>
    </div>
  )
}
