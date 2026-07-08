import { v4 as uuidv4 } from 'uuid'
import { formatMoney } from '../utils/formatting'
import { calcTotals } from '../utils/calculations'

const STATUSES = ['Draft', 'Sent', 'Paid', 'Overdue']

const STATUS_DOT = {
  Draft:   'bg-gray-400',
  Sent:    'bg-blue-500',
  Paid:    'bg-green-500',
  Overdue: 'bg-red-500',
}

export default function InvoiceForm({ invoice, onChange, onSetField, onNew, onPreview, errors, docConfig }) {
  const fmt = v => formatMoney(v, invoice.currency)
  const totals = calcTotals(invoice.lineItems, invoice.discountPct, invoice.taxPct)
  const {
    docTitle    = 'Invoice',
    numberLabel = 'Invoice #',
    dueDateLabel = 'Due date',
    billToLabel  = 'Bill to',
  } = docConfig || {}

  const handleLogoUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => onSetField('from.logoBase64', reader.result)
    reader.readAsDataURL(file)
  }

  const addItem = () => {
    onChange(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, { id: uuidv4(), description: '', quantity: 1, rate: 0 }],
    }))
  }

  const updateItem = (id, field, value) => {
    onChange(prev => ({
      ...prev,
      lineItems: prev.lineItems.map(item => item.id === id ? { ...item, [field]: value } : item),
    }))
  }

  const removeItem = (id) => {
    onChange(prev => ({
      ...prev,
      lineItems: prev.lineItems.filter(item => item.id !== id),
    }))
  }

  const status = invoice.status || 'Draft'

  return (
    <div className="max-w-[920px] mx-auto px-4 py-8">

      {/* Status row */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-[18px] font-bold text-[var(--ink)]">{docTitle} Details</h2>
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-[var(--muted)]">Status:</span>
            <div className="flex items-center gap-1.5 border border-[var(--line)] rounded-lg px-2.5 py-1.5 bg-white">
              <span className={`w-2 h-2 rounded-full shrink-0 ${STATUS_DOT[status] || 'bg-gray-400'}`} />
              <select
                value={status}
                onChange={e => onSetField('status', e.target.value)}
                className="text-[13px] text-[var(--ink)] focus:outline-none bg-transparent pr-1"
              >
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>
        <button
          onClick={onNew}
          className="flex items-center gap-1.5 px-4 py-2 border border-[var(--line)] rounded-lg text-[13px] font-medium text-[var(--ink)] bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
        >
          + New {docTitle}
        </button>
      </div>

      {/* ── Two columns: Business Details | Bill To ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">

        {/* Business Details */}
        <div className="bg-white rounded-xl border border-[var(--line)] p-6">
          <h3 className="font-bold text-[var(--ink)] text-[15px] mb-5 flex items-center gap-2">
            <span>📄</span> Your Business Details
          </h3>

          {/* Logo */}
          <div className="mb-5">
            <p className="text-[12.5px] font-medium text-[var(--ink)] mb-2">Company Logo</p>
            {invoice.from.logoBase64 ? (
              <div className="relative inline-block group">
                <img
                  src={invoice.from.logoBase64}
                  alt="Logo"
                  className="max-h-20 max-w-[180px] object-contain rounded-lg border border-[var(--line)] p-2"
                />
                <button
                  onClick={() => onSetField('from.logoBase64', null)}
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[var(--danger)] text-white text-xs hidden group-hover:flex items-center justify-center"
                >×</button>
              </div>
            ) : (
              <label className="cursor-pointer block w-full border-2 border-dashed border-[var(--line-strong)] rounded-xl py-7 px-4 text-center hover:border-[var(--accent)] transition-colors">
                <div className="flex justify-center mb-2 text-[var(--muted)]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                </div>
                <p className="text-[12.5px] text-[var(--muted)] mb-3">Upload your company logo</p>
                <span className="inline-block px-5 py-2 bg-[var(--ink)] text-white text-[12.5px] font-semibold rounded-lg">
                  Choose File
                </span>
                <input type="file" accept="image/*" className="sr-only" onChange={handleLogoUpload} />
              </label>
            )}
          </div>

          <Field label="Company Name"              value={invoice.from.name}                    onChange={v => onSetField('from.name', v)}            placeholder="Your Company Name" />
          <Field label="Address"                   value={invoice.from.address}                 onChange={v => onSetField('from.address', v)}         placeholder="Your company address" multiline />
          <Field label="Email"                     value={invoice.from.email}                   onChange={v => onSetField('from.email', v)}           placeholder="company@example.com" />
          <Field label="Phone"                     value={invoice.from.phone}                   onChange={v => onSetField('from.phone', v)}           placeholder="+1 (555) 123-4567" />
          <Field label="Tax ID / EIN"              value={invoice.from.taxNumber}               onChange={v => onSetField('from.taxNumber', v)}      placeholder="12-3456789" />
          <Field label="Business License (Optional)" value={invoice.from.businessLicense || ''} onChange={v => onSetField('from.businessLicense', v)} placeholder="Business License Number" />
          <Field label="Website (Optional)"        value={invoice.from.website || ''}           onChange={v => onSetField('from.website', v)}        placeholder="www.yourcompany.com" />
        </div>

        {/* Bill To */}
        <div className="bg-white rounded-xl border border-[var(--line)] p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-[var(--ink)] text-[15px]">{billToLabel || 'Bill To'}</h3>
            <button className="flex items-center gap-1 px-3 py-1.5 bg-[var(--ink)] text-white text-[12.5px] font-semibold rounded-lg hover:bg-[#2a3142] transition-colors">
              + Add Client
            </button>
          </div>

          {/* Client selector */}
          <div className="mb-4">
            <label className="block text-[12.5px] font-medium text-[var(--ink)] mb-1.5">Select Client</label>
            <div className="relative">
              <select
                defaultValue=""
                className="w-full border border-[var(--line-strong)] rounded-lg px-3 py-2.5 text-[13.5px] text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] bg-white appearance-none pr-8"
              >
                <option value="" disabled>Select a saved client or create new</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[var(--muted)]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </div>
            </div>
          </div>

          <Field label="Client Name"     value={invoice.to.name}           onChange={v => onSetField('to.name', v)}    placeholder="Client or Company Name" error={errors['to.name']} required />
          <Field label="Address"         value={invoice.to.address}        onChange={v => onSetField('to.address', v)} placeholder="Client address" multiline />
          <Field label="Email"           value={invoice.to.email}          onChange={v => onSetField('to.email', v)}   placeholder="client@example.com" />
          <Field label="Phone"           value={invoice.to.phone || ''}    onChange={v => onSetField('to.phone', v)}   placeholder="+1 (555) 123-4567" />
          <Field label="Tax ID (Optional)" value={invoice.to.taxId || ''} onChange={v => onSetField('to.taxId', v)}   placeholder="Tax ID Number" />
        </div>
      </div>

      {/* ── Invoice Details ── */}
      <div className="bg-white rounded-xl border border-[var(--line)] p-6 mb-5">
        <h3 className="font-bold text-[var(--ink)] text-[15px] mb-5 flex items-center gap-2">
          <span>🗓</span> {docTitle} Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <Field label={numberLabel}  value={invoice.invoiceNumber} onChange={v => onSetField('invoiceNumber', v)} placeholder="INV-0001" />
          <Field label="Issue Date"   value={invoice.issueDate}     onChange={v => onSetField('issueDate', v)}     type="date" />
          <Field label={dueDateLabel} value={invoice.dueDate}       onChange={v => onSetField('dueDate', v)}       type="date" />
        </div>
      </div>

      {/* ── Line Items ── */}
      <div className="bg-white rounded-xl border border-[var(--line)] p-6 mb-5">
        <h3 className="font-bold text-[var(--ink)] text-[15px] mb-4">Line Items</h3>

        <div className="flex items-center gap-2 mb-4">
          <button className="text-[12.5px] font-medium text-[var(--ink)] px-3 py-1.5 border border-[var(--line)] rounded-lg hover:border-[var(--accent)] transition-colors bg-white">
            Quick Add Items
          </button>
          <button className="text-[12.5px] font-medium text-[var(--ink)] px-3 py-1.5 border border-[var(--line)] rounded-lg hover:border-[var(--accent)] transition-colors bg-white">
            + Add to Catalog
          </button>
        </div>

        {errors['lineItems'] && <p className="text-[var(--danger)] text-xs mb-2">{errors['lineItems']}</p>}

        {/* Items rows */}
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
                    className="flex items-center justify-center text-[var(--muted)] hover:text-[var(--danger)] text-xl leading-none"
                  >×</button>
                </div>
              )
            })}
          </div>
        )}

        <button
          onClick={addItem}
          className="w-full py-3 bg-[var(--ink)] text-white font-bold text-[14px] rounded-lg hover:bg-[#2a3142] transition-colors mb-5"
        >
          Add Item
        </button>

        {/* Tax + Totals */}
        <div className="flex flex-col sm:flex-row justify-between gap-6">
          <div className="w-full sm:w-[180px]">
            <label className="block text-[12.5px] font-medium text-[var(--ink)] mb-1.5">Tax Rate (%)</label>
            <input
              className="w-full border border-[var(--line-strong)] rounded-lg px-3 py-2 text-[13.5px] text-[var(--ink)] focus:outline-none focus:border-[var(--accent)]"
              value={invoice.taxPct}
              inputMode="decimal"
              onChange={e => {
                const v = parseFloat(e.target.value)
                onSetField('taxPct', isNaN(v) ? 0 : Math.max(0, Math.min(100, v)))
              }}
            />
          </div>
          <div className="sm:min-w-[240px]">
            <div className="flex justify-between text-[13.5px] py-2 border-b border-[var(--line)]">
              <span className="text-[var(--muted)]">Subtotal:</span>
              <span className="font-medium tabular-nums">{fmt(totals.subtotal)}</span>
            </div>
            <div className="flex justify-between text-[13.5px] py-2 border-b border-[var(--line)]">
              <span className="text-[var(--muted)]">Tax ({invoice.taxPct || 0}%):</span>
              <span className="font-medium tabular-nums">{fmt(totals.tax)}</span>
            </div>
            <div className="flex justify-between text-[16px] font-extrabold py-2">
              <span>Total:</span>
              <span className="text-[var(--accent)] tabular-nums">{fmt(totals.grand)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Notes + Payment Terms ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
        <div className="bg-white rounded-xl border border-[var(--line)] p-6">
          <h3 className="font-bold text-[var(--ink)] text-[15px] mb-3">Additional Notes</h3>
          <textarea
            className="w-full border border-[var(--line-strong)] rounded-lg px-3 py-2.5 text-[13.5px] text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] resize-none"
            rows={5}
            placeholder="Additional notes, project details, or special instructions..."
            value={invoice.notes || ''}
            onChange={e => onSetField('notes', e.target.value)}
          />
        </div>
        <div className="bg-white rounded-xl border border-[var(--line)] p-6">
          <h3 className="font-bold text-[var(--ink)] text-[15px] mb-3">Payment Terms</h3>
          <textarea
            className="w-full border border-[var(--line-strong)] rounded-lg px-3 py-2.5 text-[13.5px] text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] resize-none"
            rows={5}
            placeholder="Example: Payment is due within 30 days of invoice date. Late payments may be subject to fees."
            value={invoice.paymentTerms || ''}
            onChange={e => onSetField('paymentTerms', e.target.value)}
          />
        </div>
      </div>

      {/* ── Payment & Legal Information ── */}
      <div className="bg-white rounded-xl border border-[var(--line)] p-6 mb-6">
        <h3 className="font-bold text-[var(--ink)] text-[15px] mb-5">Payment & Legal Information</h3>
        <Field label="Accepted Payment Methods"  value={invoice.paymentMethods || ''}    onChange={v => onSetField('paymentMethods', v)}    placeholder="Example: Bank Transfer, Credit Card, PayPal" multiline />
        <Field label="Late Fee Policy"           value={invoice.lateFeePolicy || ''}     onChange={v => onSetField('lateFeePolicy', v)}     placeholder="Example: A late fee of 1.5% per month will be applied to overdue balances." multiline />
        <Field label="Dispute Resolution Process" value={invoice.disputeResolution || ''} onChange={v => onSetField('disputeResolution', v)} placeholder="Example: Please submit any invoice disputes in writing within 14 days of receipt." multiline />
      </div>

      {/* Preview Invoice button */}
      <div className="flex justify-end pb-10">
        <button
          onClick={onPreview}
          className="px-8 py-3 bg-[var(--ink)] text-white font-bold text-[14px] rounded-lg hover:bg-[#2a3142] transition-colors"
        >
          Preview Invoice
        </button>
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
    </div>
  )
}
