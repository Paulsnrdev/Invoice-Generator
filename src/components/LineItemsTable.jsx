import { useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { formatMoney } from '../utils/formatting'

export default function LineItemsTable({ lineItems, currency, errors, onChange }) {
  const fmt = v => formatMoney(v, currency)

  const updateItem = useCallback((id, field, value) => {
    onChange(prev => ({
      ...prev,
      lineItems: prev.lineItems.map(item => item.id === id ? { ...item, [field]: value } : item),
    }))
  }, [onChange])

  const addItem = useCallback(() => {
    onChange(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, { id: uuidv4(), description: '', quantity: 1, rate: 0 }],
    }))
  }, [onChange])

  const removeItem = useCallback((id) => {
    onChange(prev => ({
      ...prev,
      lineItems: prev.lineItems.filter(item => item.id !== id),
    }))
  }, [onChange])

  return (
    <>
      <table className="w-full border-collapse mb-2">
        <thead>
          <tr>
            <th className="text-left text-[11px] font-semibold tracking-[.08em] uppercase text-[var(--muted)] pb-2.5 px-2 border-b-[1.5px] border-[var(--ink)] w-[52%]">Description</th>
            <th className="text-right text-[11px] font-semibold tracking-[.08em] uppercase text-[var(--muted)] pb-2.5 px-2 border-b-[1.5px] border-[var(--ink)]">Qty</th>
            <th className="text-right text-[11px] font-semibold tracking-[.08em] uppercase text-[var(--muted)] pb-2.5 px-2 border-b-[1.5px] border-[var(--ink)]">Rate</th>
            <th className="text-right text-[11px] font-semibold tracking-[.08em] uppercase text-[var(--muted)] pb-2.5 px-2 border-b-[1.5px] border-[var(--ink)]">Amount</th>
          </tr>
        </thead>
        <tbody>
          {lineItems.map((item, i) => {
            const qty = parseFloat(item.quantity) || 0
            const rate = parseFloat(item.rate) || 0
            const amount = qty * rate
            const descErr = errors[`item.${i}.description`]
            const qtyErr = errors[`item.${i}.quantity`]
            return (
              <tr key={item.id} className="group border-b border-[var(--line)]">
                <td className="py-3 px-2 align-top relative">
                  {/* Delete button — hidden until row hovered */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="no-print absolute left-[-28px] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-[var(--muted)] hover:text-[var(--danger)] hover:bg-[#fbeaea] w-6 h-6 flex items-center justify-center rounded text-lg leading-none transition-opacity"
                    title="Remove row"
                  >×</button>
                  {descErr && <p className="text-[var(--danger)] text-[11px] mb-0.5">{descErr}</p>}
                  <input
                    className={`edit font-medium ${descErr ? 'border-[var(--danger)]' : ''}`}
                    value={item.description}
                    placeholder="Describe the item or service"
                    onChange={e => updateItem(item.id, 'description', e.target.value)}
                  />
                </td>
                <td className="py-3 px-2 align-top font-[tabular-nums]">
                  {qtyErr && <p className="text-[var(--danger)] text-[11px] mb-0.5 text-right">{qtyErr}</p>}
                  <input
                    className={`edit text-right ${qtyErr ? 'border-[var(--danger)]' : ''}`}
                    value={item.quantity}
                    placeholder="1"
                    inputMode="decimal"
                    onChange={e => updateItem(item.id, 'quantity', e.target.value)}
                  />
                </td>
                <td className="py-3 px-2 align-top font-[tabular-nums]">
                  <input
                    className="edit text-right"
                    value={item.rate}
                    placeholder="0.00"
                    inputMode="decimal"
                    onChange={e => updateItem(item.id, 'rate', e.target.value)}
                  />
                </td>
                <td className="py-3 px-2 align-top text-right font-semibold font-[tabular-nums] whitespace-nowrap">
                  {fmt(amount)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <button
        onClick={addItem}
        className="no-print w-full mt-3 mb-7 border border-dashed border-[var(--line-strong)] text-[var(--accent)] font-semibold text-[13.5px] py-2.5 rounded-lg hover:bg-[var(--accent-soft)] hover:border-[var(--accent)] transition-colors"
      >
        + Add line item
      </button>
    </>
  )
}
