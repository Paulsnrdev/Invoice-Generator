import { useRef, useState, useCallback } from 'react'
import { CURRENCIES } from '../utils/formatting'
import { calcTotals } from '../utils/calculations'
import InvoiceSheet from './InvoiceSheet'
import Toolbar from './Toolbar'

export default function InvoiceEditor({ invoice, onChange, onSave, onNew, onShowList, savedCount }) {
  const sheetRef = useRef(null)
  const [saved, setSaved] = useState(false)
  const [errors, setErrors] = useState({})

  const set = useCallback((path, value) => {
    onChange(prev => {
      const next = structuredClone(prev)
      const keys = path.split('.')
      let obj = next
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]]
      obj[keys[keys.length - 1]] = value
      return next
    })
  }, [onChange])

  const validate = () => {
    const e = {}
    if (!invoice.to.name.trim()) e['to.name'] = 'Client name is required'
    if (invoice.lineItems.length === 0) e['lineItems'] = 'Add at least one line item'
    invoice.lineItems.forEach((item, i) => {
      if (!item.description.trim()) e[`item.${i}.description`] = 'Description required'
      if (parseFloat(item.quantity) <= 0 || isNaN(parseFloat(item.quantity)))
        e[`item.${i}.quantity`] = 'Qty must be > 0'
    })
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    onSave()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleDownloadPdf = async () => {
    const html2pdf = (await import('html2pdf.js')).default
    const el = sheetRef.current
    if (!el) return

    // html2canvas doesn't render <input>/<textarea> values reliably —
    // clone the sheet and replace every form element with a plain text node.
    const clone = el.cloneNode(true)

    clone.querySelectorAll('.no-print').forEach(n => n.remove())

    clone.querySelectorAll('input, textarea').forEach(input => {
      const isTextarea = input.tagName === 'TEXTAREA'
      const replacement = document.createElement(isTextarea ? 'div' : 'span')
      replacement.textContent = input.value
      // Preserve the visual class so font/size/alignment stays correct
      replacement.className = input.className
      replacement.style.cssText = input.style.cssText
      // Inputs with text-align:right need it on the replacement too
      const align = window.getComputedStyle(input).textAlign
      if (align) replacement.style.textAlign = align
      input.replaceWith(replacement)
    })

    // Mount off-screen so layout computes correctly
    clone.style.position = 'fixed'
    clone.style.top = '-9999px'
    clone.style.left = '0'
    clone.style.width = el.offsetWidth + 'px'
    document.body.appendChild(clone)

    try {
      await html2pdf()
        .set({
          margin: [10, 10, 10, 10],
          filename: `${invoice.invoiceNumber || 'invoice'}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, logging: false },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        })
        .from(clone)
        .save()
    } finally {
      document.body.removeChild(clone)
    }
  }

  const totals = calcTotals(invoice.lineItems, invoice.discountPct, invoice.taxPct)

  return (
    <>
      <Toolbar
        currency={invoice.currency}
        onCurrencyChange={v => set('currency', v)}
        onNew={onNew}
        onSave={handleSave}
        onDownloadPdf={handleDownloadPdf}
        onShowList={onShowList}
        savedCount={savedCount}
        saved={saved}
      />

      <div className="py-8 px-4 pb-20 no-print">
        {/* Mobile hint */}
        <p className="text-center text-xs text-[var(--muted)] mb-5">
          Click any field to edit it. Hover a row to remove it.
        </p>
      </div>

      {/* The div below is what gets exported as PDF */}
      <div className="px-4 pb-20 -mt-16">
        <InvoiceSheet
          ref={sheetRef}
          invoice={invoice}
          totals={totals}
          errors={errors}
          onChange={onChange}
          onSetField={set}
        />
      </div>
    </>
  )
}
