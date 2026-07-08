import { useRef, useState, useCallback } from 'react'
import { CURRENCIES } from '../utils/formatting'
import { calcTotals } from '../utils/calculations'
import { buildPrintHtml } from '../utils/buildPrintHtml'
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

    // Build a clean static HTML string — no inputs, no buttons, only data.
    // This is far more reliable than screenshotting the live React DOM.
    const htmlString = buildPrintHtml(invoice)

    const container = document.createElement('div')
    container.style.cssText = 'position:fixed;top:-9999px;left:0;width:210mm;background:#fff;'
    container.innerHTML = htmlString
    document.body.appendChild(container)

    try {
      await html2pdf()
        .set({
          margin: [0, 0, 0, 0],
          filename: `${invoice.invoiceNumber || 'invoice'}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, logging: false },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        })
        .from(container.firstElementChild)
        .save()
    } finally {
      document.body.removeChild(container)
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
