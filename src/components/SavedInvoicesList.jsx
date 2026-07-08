import { formatMoney } from '../utils/formatting'
import { calcTotals } from '../utils/calculations'

export default function SavedInvoicesList({ invoices, onOpen, onDuplicate, onDelete, onNew, onBack }) {
  return (
    <div className="min-h-screen bg-[#eceded]">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center gap-3 px-5 py-3.5 bg-[rgba(236,237,237,.88)] backdrop-blur border-b border-[var(--line)]">
        <div className="mr-auto flex items-center gap-2 font-bold tracking-tight">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)]" />
          Saved Invoices
        </div>
        <button onClick={onBack} className="text-[14px] rounded-lg border border-[var(--line-strong)] bg-white px-3 py-2 hover:border-[#a9adb7]">
          ← Back
        </button>
        <button onClick={onNew} className="text-[14px] rounded-lg border border-[var(--accent)] bg-[var(--accent)] text-white px-3 py-2 font-semibold hover:bg-[#0c5f58]">
          + New Invoice
        </button>
      </div>

      <div className="max-w-[820px] mx-auto px-4 py-8">
        {invoices.length === 0 ? (
          <div className="text-center py-24 text-[var(--muted)]">
            <p className="text-4xl mb-4">📄</p>
            <p className="text-lg font-medium mb-1">No saved invoices yet</p>
            <p className="text-sm">Fill out an invoice and click <strong>Save</strong> to store it here.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {invoices.map(inv => {
              const totals = calcTotals(inv.lineItems, inv.discountPct, inv.taxPct)
              const grand = formatMoney(totals.grand, inv.currency)
              const date = inv.issueDate || '—'
              return (
                <li key={inv.id} className="bg-white rounded-lg border border-[var(--line)] px-5 py-4 flex items-center gap-4 hover:border-[var(--accent)] transition-colors group">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[15px] truncate">{inv.invoiceNumber || 'Untitled'}</p>
                    <p className="text-[13px] text-[var(--muted)] truncate">
                      {inv.to?.name || 'No client'} · {date}
                    </p>
                  </div>
                  <p className="font-bold text-[var(--accent)] tabular-nums whitespace-nowrap">{grand}</p>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => onOpen(inv)}
                      className="text-[13px] px-3 py-1.5 rounded-md border border-[var(--line-strong)] bg-white hover:border-[var(--accent)] hover:text-[var(--accent)]"
                    >Open</button>
                    <button
                      onClick={() => onDuplicate(inv)}
                      className="text-[13px] px-3 py-1.5 rounded-md border border-[var(--line-strong)] bg-white hover:border-[var(--accent)] hover:text-[var(--accent)]"
                    >Duplicate</button>
                    <button
                      onClick={() => { if (confirm(`Delete ${inv.invoiceNumber}?`)) onDelete(inv.id) }}
                      className="text-[13px] px-3 py-1.5 rounded-md border border-transparent text-[var(--muted)] hover:border-[var(--danger)] hover:text-[var(--danger)]"
                    >Delete</button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
