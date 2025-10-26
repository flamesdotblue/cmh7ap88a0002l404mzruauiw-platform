import { CheckCircle2, Clock, DollarSign, Users } from 'lucide-react'

function Stat({ icon: Icon, label, value, sub }) {
  return (
    <div className="flex items-center gap-4 rounded-lg border bg-white p-4 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-br from-sky-500/10 to-indigo-500/10 text-indigo-600">
        <Icon size={18} />
      </div>
      <div>
        <div className="text-sm text-slate-500">{label}</div>
        <div className="text-lg font-semibold text-slate-900">{value}</div>
        {sub ? <div className="text-xs text-slate-500">{sub}</div> : null}
      </div>
    </div>
  )
}

export default function StatsCards({ total, approvalRate, totalAmount, avgTicket }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Stat icon={Users} label="Applications" value={total} />
      <Stat icon={CheckCircle2} label="Approval rate" value={`${approvalRate}%`} sub="Last 120 days" />
      <Stat icon={DollarSign} label="Funded amount" value={`$${totalAmount.toLocaleString()}`} sub="Sum of filtered" />
      <Stat icon={Clock} label="Avg. ticket" value={`$${avgTicket.toLocaleString()}`} />
    </div>
  )
}
