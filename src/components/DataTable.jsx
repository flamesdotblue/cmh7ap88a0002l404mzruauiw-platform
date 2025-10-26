import { useMemo, useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { ArrowDownUp, ChevronDown, Download, Eye, Edit, MoreHorizontal } from 'lucide-react'
import { toast } from 'sonner'
import Papa from 'papaparse'
import { format } from 'date-fns'

function StatusBadge({ status }) {
  const map = {
    Approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
    Rejected: 'bg-rose-50 text-rose-700 border-rose-200',
    'In Review': 'bg-sky-50 text-sky-700 border-sky-200',
  }
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${map[status] || ''}`}>{status}</span>
  )
}

export default function DataTable({ data }) {
  const [sorting, setSorting] = useState([{ id: 'createdAt', desc: true }])
  const [rowSelection, setRowSelection] = useState({})

  const columns = useMemo(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={table.getIsAllPageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
        enableSorting: false,
        size: 32,
      },
      {
        accessorKey: 'id',
        header: () => (
          <div className="inline-flex items-center gap-1">
            ID <ArrowDownUp size={14} className="text-slate-400" />
          </div>
        ),
        cell: ({ row }) => <span className="font-medium text-slate-800">{row.original.id}</span>,
      },
      {
        accessorKey: 'applicant',
        header: 'Applicant',
        cell: ({ row }) => (
          <div>
            <div className="font-medium">{row.original.applicant}</div>
            <div className="text-xs text-slate-500">{row.original.product}</div>
          </div>
        ),
      },
      {
        accessorKey: 'partner',
        header: 'Partner',
        cell: ({ row }) => row.original.partner,
      },
      {
        accessorKey: 'amount',
        header: 'Amount',
        cell: ({ row }) => `$${row.original.amount.toLocaleString()}`,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        accessorKey: 'score',
        header: 'Score',
        cell: ({ row }) => (
          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-700">{row.original.score}</span>
        ),
      },
      {
        accessorKey: 'createdAt',
        header: 'Created',
        cell: ({ row }) => format(new Date(row.original.createdAt), 'PP')
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => <RowActions row={row.original} />,
        enableSorting: false,
        size: 48,
      },
    ],
    []
  )

  const table = useReactTable({
    data,
    columns,
    state: { sorting, rowSelection },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const exportCSV = () => {
    const rows = table.getFilteredSelectedRowModel().rows.length
      ? table.getFilteredSelectedRowModel().rows.map((r) => r.original)
      : data
    const csv = Papa.unparse(
      rows.map((r) => ({
        id: r.id,
        applicant: r.applicant,
        partner: r.partner,
        product: r.product,
        amount: r.amount,
        status: r.status,
        score: r.score,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      }))
    )
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `loans_export_${Date.now()}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success(`Exported ${rows.length} rows`)
  }

  return (
    <div className="w-full">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm text-slate-600">
          {table.getRowModel().rows.length} results
          {Object.keys(rowSelection).length > 0 && (
            <span className="ml-2 rounded-md bg-blue-50 px-2 py-0.5 text-blue-700">
              {Object.keys(rowSelection).length} selected
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <ColumnVisibility table={table} />
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-2 rounded-md border bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    style={{ width: header.getSize?.() }}
                    className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-600"
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={header.column.getCanSort() ? 'cursor-pointer select-none inline-flex items-center gap-1' : ''}
                        onClick={header.column.getToggleSortingHandler?.()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{ asc: '↑', desc: '↓' }[header.column.getIsSorted()] ?? null}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="whitespace-nowrap px-3 py-3 text-sm text-slate-700">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            {table.getRowModel().rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-3 py-10 text-center text-sm text-slate-500">
                  No results match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
        <div className="text-sm text-slate-500">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
        <div className="flex items-center gap-2">
          <button
            className="rounded-md border bg-white px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            First
          </button>
          <button
            className="rounded-md border bg-white px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Prev
          </button>
          <button
            className="rounded-md border bg-white px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </button>
          <button
            className="rounded-md border bg-white px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            Last
          </button>
          <select
            className="ml-2 rounded-md border bg-white px-2 py-1.5 text-sm"
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
          >
            {[10, 20, 30, 50].map((size) => (
              <option key={size} value={size}>
                {size} / page
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

function RowActions({ row }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="inline-flex items-center justify-center rounded-md border bg-white px-2 py-1 text-slate-600 hover:bg-slate-50">
          <MoreHorizontal size={16} />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content sideOffset={6} className="z-50 min-w-[160px] rounded-md border bg-white p-1 text-sm shadow-xl">
        <DropdownMenu.Item asChild>
          <button
            onClick={() => alert(`Viewing ${row.id}`)}
            className="flex w-full items-center gap-2 rounded-sm px-2 py-2 text-left hover:bg-slate-50"
          >
            <Eye size={16} /> View
          </button>
        </DropdownMenu.Item>
        <DropdownMenu.Item asChild>
          <button
            onClick={() => alert(`Editing ${row.id}`)}
            className="flex w-full items-center gap-2 rounded-sm px-2 py-2 text-left hover:bg-slate-50"
          >
            <Edit size={16} /> Edit
          </button>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

function ColumnVisibility({ table }) {
  const all = table.getAllLeafColumns().filter((c) => c.id !== 'select' && c.getCanHide?.())
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="inline-flex items-center gap-2 rounded-md border bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50">
          Columns <ChevronDown size={16} />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content sideOffset={6} className="z-50 min-w-[200px] rounded-md border bg-white p-1 text-sm shadow-xl">
        {all.map((col) => (
          <DropdownMenu.CheckboxItem
            key={col.id}
            checked={col.getIsVisible()}
            onCheckedChange={(v) => col.toggleVisibility(!!v)}
            className="flex cursor-pointer items-center justify-between rounded-sm px-2 py-2 hover:bg-slate-50"
          >
            <span className="capitalize">{col.id}</span>
          </DropdownMenu.CheckboxItem>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
