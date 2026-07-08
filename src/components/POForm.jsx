import { v4 as uuidv4 } from 'uuid'
import { formatMoney } from '../utils/formatting'

export default function POForm({ invoice, onChange, onSetField, onNew, onPreview, errors }) {
  const fmt = v => formatMoney(v, invoice.currency)

  const subtotal = invoice.lineItems.reduce((s, item) => s + (parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0), 0)
  const taxAmt   = parseFloat(invoice.taxPct) || 0
  const shipAmt  = parseFloat(invoice.shippingCost) || 0
  const total    = subtotal + taxAmt + shipAmt

  const addItem = () => onChange(prev => ({
    ...prev,
    lineItems: [...prev.lineItems, { id: uuidv4(), description: '', quantity: 1, rate: 0 }],
  }))

  const updateItem = (id, field, value) => onChange(prev => ({
    ...prev,
    lineItems: prev.lineItems.map(item => item.id === id ? { ...item, [field]: value } : item),
  }))

  const removeItem = (id) => onChange(prev => ({
    ...prev,
    lineItems: prev.lineItems.filter(item => item.id !== id),
  }))

  return (
    <div className="max-w-[920px] mx-auto px-4 py-8">

      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[18px] font-bold text-[var(--ink)]">Purchase Order Details</h2>
        <button
          onClick={onNew}
          className="flex items-center gap-1.5 px-4 py-2 border border-[var(--line)] rounded-lg text-[13px] font-medium text-[var(--ink)] bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
        >
          + New Purchase Order
        </button>
      </div>

      {/* PO Details card */}
      <div className="bg-white rounded-xl border border-[var(--line)] p-6 mb-5">
        <h3 className="font-bold text-[var(--ink)] text-[15px] mb-5">Purchase Order Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <Field label="PO Number"               value={invoice.invoiceNumber} onChange={v => onSetField('invoiceNumber', v)} placeholder="PO-2026-0001" />
          <Field label="Issue Date"              value={invoice.issueDate}     onChange={v => onSetField('issueDate', v)}     type="date" />
          <Field label="Expected Delivery Date"  value={invoice.dueDate}       onChange={v => onSetField('dueDate', v)}       type="date" />
        </div>
      </div>

      {/* Two-column: Buyer | Seller */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">

        <div className="bg-white rounded-xl border border-[var(--line)] p-6">
          <h3 className="font-bold text-[var(--ink)] text-[15px] mb-5">Your Company (Buyer)</h3>
          <Field label="Company Name" value={invoice.from.name}    onChange={v => onSetField('from.name', v)}    placeholder="Your Company LLC" />
          <Field label="Address"      value={invoice.from.address} onChange={v => onSetField('from.address', v)} placeholder="123 Main St, Anytown, USA" multiline />
          <Field label="Email"        value={invoice.from.email}   onChange={v => onSetField('from.email', v)}   placeholder="contact@yourcompany.com" />
          <Field label="Phone"        value={invoice.from.phone}   onChange={v => onSetField('from.phone', v)}   placeholder="(555) 123-4567" />
        </div>

        <div className="bg-white rounded-xl border border-[var(--line)] p-6">
          <h3 className="font-bold text-[var(--ink)] text-[15px] mb-5">Vendor (Seller)</h3>
          <Field label="Vendor Name" value={invoice.to.name}        onChange={v => onSetField('to.name', v)}    placeholder="Supplier Inc." error={errors['to.name']} required />
          <Field label="Address"     value={invoice.to.address}     onChange={v => onSetField('to.address', v)} placeholder="456 Vendor Ave, Otherville, USA" multiline />
          <Field label="Email"       value={invoice.to.email}       onChange={v => onSetField('to.email', v)}   placeholder="sales@supplier.com" />
          <Field label="Phone"       value={invoice.to.phone || ''} onChange={v => onSetField('to.phone', v)}   placeholder="(555) 987-6543" />
        </div>
      </div>

      {/* Line Items */}
      <div className="bg-white rounded-xl border border-[var(--line)] p-6 mb-5">
        <h3 className="font-bold text-[var(--ink)] text-[15px] mb-4">Line Items</h3>

        {errors['lineItems'] && <p className="text-[var(--danger)] text-xs mb-2">{errors['lineItems']}</p>}

        {invoice.lineItems.length > 0 && (
          <div className="mb-4">
            <div className="hidden sm:grid gap-2 mb-2 px-1 text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wide"
                 style={{ gridTemplateColumns: '1fr 70px 90px 90px 28px' }}>
              <span>Description</span>
              <span className="text-right">Qty</span>
              <span className="text-right">Rate</span>
              <span className="text-right">Amount</span>
              <span />
            </div>

            {invoice.lineItems.map((item, i) => {
              const amount  = (parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0)
              const descErr = errors[`item.${i}.description`]
              const qtyErr  = errors[`item.${i}.quantity`]
              return (
                <div key={item.id} className="grid gap-2 mb-2 items-center"
                     style={{ gridTemplateColumns: '1fr 70px 90px 90px 28px' }}>
                  <input
                    className={`w-full border rounded-lg px-3 py-2 text-[13.5px] text-[var(--ink)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] ${descErr ? 'border-[var(--danger)]' : 'border-[var(--line-strong)]'}`}
                    placeholder="Item description"
                    value={item.description}
                    onChange={e => updateItem(item.id, 'description', e.target.value)}
                  />
                  <input
                    className={`w-full border rounded-lg px-2 py-2 text-[13.5px] text-right text-[var(--ink)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] ${qtyErr ? 'border-[var(--danger)]' : 'border-[var(--line-strong)]'}`}
                    value={item.quantity}
                    inputMode="decimal"
                    onChange={e => updateItem(item.id, 'quantity', e.target.value)}
                  />
                  <input
                    className="w-full border border-[var(--line-strong)] rounded-lg px-2 py-2 text-[13.5px] text-right text-[var(--ink)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
                    value={item.rate}
                    inputMode="decimal"
                    onChange={e => updateItem(item.id, 'rate', e.target.value)}
                  />
                  <span className="text-right text-[13px] font-semibold text-[var(--ink)] tabular-nums">
                    {fmt(amount)}
                  </span>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="flex items-center justify-center text-[var(--muted)] hover:text-[var(--danger)] transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
                    </svg>
                  </button>
                </div>
              )
            })}
          </div>
        )}

        <button
          onClick={addItem}
          className="px-4 py-2 border border-[var(--line-strong)] text-[13px] font-medium text-[var(--ink)] rounded-lg hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors bg-white"
        >
          Add Item
        </button>
      </div>

      {/* Shipping / Notes / Totals */}
      <div className="bg-white rounded-xl border border-[var(--line)] p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-8">

          {/* Left */}
          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-[12.5px] font-medium text-[var(--ink)] mb-1.5">Shipping Address</label>
              <textarea
                className="w-full border border-[var(--line-strong)] rounded-lg px-3 py-2.5 text-[13.5px] text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] resize-none"
                rows={3}
                placeholder="Enter shipping address... (defaults to company address if blank)"
                value={invoice.shippingAddress || ''}
                onChange={e => onSetField('shippingAddress', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[12.5px] font-medium text-[var(--ink)] mb-1.5">Notes / Special Instructions</label>
              <textarea
                className="w-full border border-[var(--line-strong)] rounded-lg px-3 py-2.5 text-[13.5px] text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] resize-none"
                rows={3}
                placeholder="e.g., Please include packing slip with shipment."
                value={invoice.notes || ''}
                onChange={e => onSetField('notes', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[12.5px] font-medium text-[var(--ink)] mb-1.5">Authorized By</label>
              <input
                className="w-full border border-[var(--line-strong)] rounded-lg px-3 py-2 text-[13.5px] text-[var(--ink)] focus:outline-none focus:border-[var(--accent)]"
                placeholder="Your Name"
                value={invoice.authorizedBy || ''}
                onChange={e => onSetField('authorizedBy', e.target.value)}
              />
            </div>
          </div>

          {/* Right: Totals */}
          <div className="sm:w-[300px] shrink-0">
            <div className="flex justify-between items-center py-3 border-b border-[var(--line)] text-[14px]">
              <span className="text-[var(--muted)]">Subtotal</span>
              <span className="font-medium tabular-nums">{fmt(subtotal)}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-[var(--line)] text-[14px]">
              <span className="text-[var(--muted)]">Tax</span>
              <input
                className="w-24 border border-[var(--line-strong)] rounded-lg px-2 py-1.5 text-[13.5px] text-right text-[var(--ink)] focus:outline-none focus:border-[var(--accent)]"
                value={invoice.taxPct ?? 0}
                inputMode="decimal"
                onChange={e => {
                  const v = parseFloat(e.target.value)
                  onSetField('taxPct', isNaN(v) ? 0 : Math.max(0, v))
                }}
              />
            </div>
            <div className="flex justify-between items-center py-3 border-b border-[var(--line)] text-[14px]">
              <span className="text-[var(--muted)]">Shipping</span>
              <input
                className="w-24 border border-[var(--line-strong)] rounded-lg px-2 py-1.5 text-[13.5px] text-right text-[var(--ink)] focus:outline-none focus:border-[var(--accent)]"
                value={invoice.shippingCost ?? 0}
                inputMode="decimal"
                onChange={e => {
                  const v = parseFloat(e.target.value)
                  onSetField('shippingCost', isNaN(v) ? 0 : Math.max(0, v))
                }}
              />
            </div>
            <div className="flex justify-between items-center py-3 text-[16px] font-extrabold">
              <span>Total</span>
              <span className="tabular-nums">{fmt(total)}</span>
            </div>
          </div>
        </div>

        {/* Bottom buttons */}
        <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-[var(--line)]">
          <button
            onClick={onNew}
            className="px-6 py-2.5 border border-[var(--line-strong)] rounded-lg text-[13.5px] font-medium text-[var(--ink)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
          >
            New PO
          </button>
          <button
            onClick={onPreview}
            className="px-6 py-2.5 bg-[var(--ink)] text-white font-bold text-[13.5px] rounded-lg hover:bg-[#2a3142] transition-colors"
          >
            Preview PO
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, placeholder, multiline, type, error, required }) {
  const base = `w-full border rounded-lg px-3 py-2 text-[13.5px] text-[var(--ink)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] ${error ? 'border-[var(--danger)]' : 'border-[var(--line-strong)]'}`
  return (
    <div className="mb-4 last:mb-0">
      <label className="block text-[12.5px] font-medium text-[var(--ink)] mb-1.5">
        {label}{required && <span className="text-[var(--danger)] ml-0.5">*</span>}
      </label>
      {multiline ? (
        <textarea
          className={base + ' resize-none'}
          rows={3}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      ) : (
        <input
          type={type || 'text'}
          className={base}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      )}
      {error && <p className="text-[var(--danger)] text-[11.5px] mt-1">{error}</p>}
    </div>
  )
}
