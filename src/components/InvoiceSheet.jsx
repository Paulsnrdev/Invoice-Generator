import { forwardRef, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { formatMoney } from '../utils/formatting'
import LineItemsTable from './LineItemsTable'

const InvoiceSheet = forwardRef(function InvoiceSheet({ invoice, totals, errors, onChange, onSetField }, ref) {
  const { from, to, lineItems, discountPct, taxPct, currency } = invoice
  const fmt = v => formatMoney(v, currency)

  const handleLogoUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => onSetField('from.logoBase64', reader.result)
    reader.readAsDataURL(file)
  }

  return (
    <div
      ref={ref}
      className="max-w-[820px] mx-auto bg-white rounded-sm overflow-hidden sheet-shadow"
      style={{ boxShadow: '0 1px 2px rgba(20,23,31,.04), 0 12px 40px rgba(20,23,31,.10)' }}
    >
      {/* Accent bar */}
      <div className="h-1.5 bg-[var(--accent)]" />

      <div className="px-14 py-12 max-sm:px-6 max-sm:py-8">
        {/* ── Header ── */}
        <div className="flex justify-between items-start gap-8 mb-11 max-sm:flex-col">
          {/* From / Sender */}
          <div className="max-w-[320px] w-full">
            {/* Logo */}
            <div className="mb-3">
              {from.logoBase64 ? (
                <div className="relative inline-block group no-print-hide">
                  <img src={from.logoBase64} alt="Logo" className="max-h-16 max-w-[180px] object-contain rounded" />
                  <button
                    onClick={() => onSetField('from.logoBase64', null)}
                    className="no-print absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[var(--danger)] text-white text-xs leading-none hidden group-hover:flex items-center justify-center"
                  >×</button>
                </div>
              ) : (
                <label className="no-print inline-flex items-center gap-1.5 text-xs text-[var(--muted)] cursor-pointer border border-dashed border-[var(--line-strong)] rounded-lg px-3 py-2 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors">
                  <span>+ Upload logo</span>
                  <input type="file" accept="image/*" className="sr-only" onChange={handleLogoUpload} />
                </label>
              )}
            </div>

            <div className="text-[20px] font-bold tracking-tight mb-1">
              <input className="edit w-full font-bold text-[20px]" value={from.name} placeholder="Your Name / Business"
                onChange={e => onSetField('from.name', e.target.value)} />
            </div>
            {[
              { key: 'from.email', val: from.email, ph: 'you@email.com' },
              { key: 'from.phone', val: from.phone, ph: '+234 800 000 0000' },
              { key: 'from.address', val: from.address, ph: 'City, Country' },
              { key: 'from.taxNumber', val: from.taxNumber, ph: 'RC / Tax ID (optional)' },
            ].map(({ key, val, ph }) => (
              <div key={key} className="text-[13.5px] text-[var(--muted)]">
                <input className="edit" value={val} placeholder={ph} onChange={e => onSetField(key, e.target.value)} />
              </div>
            ))}
          </div>

          {/* Doc title + meta */}
          <div className="text-right max-sm:text-left">
            <h1 className="text-[34px] font-extrabold tracking-widest uppercase text-[var(--ink)] mb-3.5">Invoice</h1>
            <div className="grid grid-cols-[auto_auto] gap-x-4 gap-y-1.5 text-[13.5px] justify-end max-sm:justify-start">
              <span className="text-[var(--muted)] self-center text-right">Invoice #</span>
              <input className="edit text-right font-[tabular-nums] min-w-[130px]"
                value={invoice.invoiceNumber} onChange={e => onSetField('invoiceNumber', e.target.value)} />

              <span className="text-[var(--muted)] self-center text-right">Issue date</span>
              <input type="date" className="edit text-right font-[tabular-nums]"
                value={invoice.issueDate} onChange={e => onSetField('issueDate', e.target.value)} />

              <span className="text-[var(--muted)] self-center text-right">Due date</span>
              <input type="date" className="edit text-right font-[tabular-nums]"
                value={invoice.dueDate} onChange={e => onSetField('dueDate', e.target.value)} />
            </div>
          </div>
        </div>

        {/* ── Bill To ── */}
        <div className="mb-8">
          <span className="block text-[11px] font-semibold tracking-[.09em] uppercase text-[var(--muted)] mb-1.5">Bill to</span>
          {errors['to.name'] && <p className="text-[var(--danger)] text-xs mb-1">{errors['to.name']}</p>}
          <input className={`edit font-semibold text-[15.5px] ${errors['to.name'] ? 'border-[var(--danger)]' : ''}`}
            value={to.name} placeholder="Client name / Company *"
            onChange={e => onSetField('to.name', e.target.value)} />
          <div className="text-[13.5px] text-[var(--muted)]">
            <input className="edit" value={to.email} placeholder="client@email.com"
              onChange={e => onSetField('to.email', e.target.value)} />
            <input className="edit" value={to.address} placeholder="Client address"
              onChange={e => onSetField('to.address', e.target.value)} />
          </div>
        </div>

        {/* ── Line Items ── */}
        {errors['lineItems'] && <p className="text-[var(--danger)] text-xs mb-2">{errors['lineItems']}</p>}
        <LineItemsTable
          lineItems={lineItems}
          currency={currency}
          errors={errors}
          onChange={onChange}
        />

        {/* ── Totals ── */}
        <div className="flex justify-end mt-2">
          <div className="w-[320px]">
            <TotalsRow label="Subtotal" value={fmt(totals.subtotal)} />
            <TotalsRow
              label={<span>Discount <RateInput value={discountPct} onChange={v => onSetField('discountPct', v)} />%</span>}
              value={totals.discount > 0 ? `–${fmt(totals.discount)}` : fmt(0)}
            />
            <TotalsRow
              label={<span>Tax / VAT <RateInput value={taxPct} onChange={v => onSetField('taxPct', v)} />%</span>}
              value={fmt(totals.tax)}
            />
            <div className="border-t-2 border-[var(--ink)] mt-1 pt-3.5 flex justify-between items-center text-[19px] font-extrabold">
              <span>Total</span>
              <span className="text-[var(--accent)]">{fmt(totals.grand)}</span>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="mt-11 pt-6 border-t border-[var(--line)] grid grid-cols-2 gap-8 max-sm:grid-cols-1">
          <div>
            <span className="block text-[11px] font-semibold tracking-[.09em] uppercase text-[var(--muted)] mb-1.5">Payment details</span>
            <textarea className="edit text-[13.5px] text-[var(--muted)] w-full" rows={4}
              value={invoice.bankDetails} placeholder="Bank name, account name, account number…"
              onChange={e => onSetField('bankDetails', e.target.value)} />
          </div>
          <div>
            <span className="block text-[11px] font-semibold tracking-[.09em] uppercase text-[var(--muted)] mb-1.5">Notes / terms</span>
            <textarea className="edit text-[13.5px] text-[var(--muted)] w-full" rows={4}
              value={invoice.notes}
              onChange={e => onSetField('notes', e.target.value)} />
          </div>
        </div>

        <p className="text-center text-[13px] text-[var(--muted)] tracking-wide mt-10">Thank you!</p>
      </div>
    </div>
  )
})

function TotalsRow({ label, value }) {
  return (
    <div className="flex justify-between items-center py-2.5 text-[14px] font-[tabular-nums]">
      <span className="text-[var(--muted)] flex items-center gap-1">{label}</span>
      <span>{value}</span>
    </div>
  )
}

function RateInput({ value, onChange }) {
  return (
    <span className="inline-block w-14">
      <input
        className="edit text-right w-full"
        value={value}
        inputMode="decimal"
        onChange={e => {
          const v = parseFloat(e.target.value)
          if (!isNaN(v) && v >= 0 && v <= 100) onChange(v)
          else if (e.target.value === '' || e.target.value === '-') onChange(0)
        }}
      />
    </span>
  )
}

export default InvoiceSheet
