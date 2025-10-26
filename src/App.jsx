import { useMemo, useState } from 'react'
import { Toaster, toast } from 'sonner'
import { format, isAfter, isBefore, parseISO, startOfDay, endOfDay } from 'date-fns'
import TopNav from './components/TopNav'
import Hero from './components/Hero'
import FiltersBar from './components/FiltersBar'
import StatsCards from './components/StatsCards'
import DataTable from './components/DataTable'
import { generateLoans } from './components/data'

export default function App() {
  const [allData] = useState(() => generateLoans(120))

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('All')
  const [partner, setPartner] = useState('All')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const partners = useMemo(() => {
    const set = new Set(allData.map((d) => d.partner))
    return ['All', ...Array.from(set)]
  }, [allData])

  const statuses = ['All', 'Approved', 'Pending', 'Rejected', 'In Review']

  const filteredData = useMemo(() => {
    const s = search.trim().toLowerCase()
    const from = dateFrom ? startOfDay(parseISO(dateFrom)) : null
    const to = dateTo ? endOfDay(parseISO(dateTo)) : null

    return allData.filter((row) => {
      if (status !== 'All' && row.status !== status) return false
      if (partner !== 'All' && row.partner !== partner) return false
      if (s) {
        const blob = `${row.id} ${row.applicant} ${row.partner} ${row.product}`.toLowerCase()
        if (!blob.includes(s)) return false
      }
      if (from && isBefore(new Date(row.createdAt), from)) return false
      if (to && isAfter(new Date(row.createdAt), to)) return false
      return true
    })
  }, [allData, search, status, partner, dateFrom, dateTo])

  const totals = useMemo(() => {
    const totalAmount = filteredData.reduce((acc, r) => acc + r.amount, 0)
    const approved = filteredData.filter((r) => r.status === 'Approved')
    const approvalRate = filteredData.length ? Math.round((approved.length / filteredData.length) * 100) : 0
    const avgTicket = filteredData.length ? Math.round(totalAmount / filteredData.length) : 0
    return { total: filteredData.length, approvalRate, totalAmount, avgTicket }
  }, [filteredData])

  const onResetFilters = () => {
    setSearch('')
    setStatus('All')
    setPartner('All')
    setDateFrom('')
    setDateTo('')
    toast.success('Filters reset')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900">
      <TopNav />
      <Hero />

      <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 -mt-24">
        <div className="rounded-xl border bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-lg">
          <div className="p-6 border-b">
            <FiltersBar
              search={search}
              setSearch={setSearch}
              status={status}
              setStatus={setStatus}
              partner={partner}
              setPartner={setPartner}
              partners={partners}
              statuses={statuses}
              dateFrom={dateFrom}
              dateTo={dateTo}
              setDateFrom={setDateFrom}
              setDateTo={setDateTo}
              onReset={onResetFilters}
            />
          </div>
          <div className="p-6 border-b">
            <StatsCards
              total={totals.total}
              approvalRate={totals.approvalRate}
              totalAmount={totals.totalAmount}
              avgTicket={totals.avgTicket}
            />
          </div>
          <div className="p-2 sm:p-6">
            <DataTable data={filteredData} />
          </div>
        </div>

        <footer className="py-10 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Partner Portal — Last refresh {format(new Date(), 'PPpp')}
        </footer>
      </main>

      <Toaster richColors position="top-center" />
    </div>
  )
}
