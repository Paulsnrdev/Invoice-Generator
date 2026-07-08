import { useRef, useState, useCallback } from 'react'
import { calcTotals } from '../utils/calculations'
import { buildPrintHtml } from '../utils/buildPrintHtml'
import InvoiceSheet from './InvoiceSheet'
import InvoiceForm from './InvoiceForm'
import QuoteForm from './QuoteForm'
import POForm from './POForm'
import Toolbar from './Toolbar'

export default function InvoiceEditor({ invoice, onChange, onSave, onNew, onShowList, savedCount, docConfig }) {
  const sheetRef = useRef(null)
  const [saved, setSaved] = useState(false)
  const [errors, setErrors] = useState({})
  const [activeTab, setActiveTab] = useState('create')

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

    const container = document.createElement('div')
    container.style.cssText = 'position:fixed;top:-9999px;left:0;width:794px;background:#fff;'
    container.innerHTML = buildPrintHtml(invoice, docConfig)
    document.body.appendChild(container)

    await new Promise(r => setTimeout(r, 150))

    try {
      await html2pdf()
        .set({
          margin: 0,
          filename: `${invoice.invoiceNumber || 'document'}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, allowTaint: true, logging: false },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        })
        .from(container.firstElementChild)
        .save()
    } finally {
      document.body.removeChild(container)
    }
  }

  const totals = calcTotals(invoice.lineItems, invoice.discountPct, invoice.taxPct)
  const docTitle       = docConfig?.docTitle       || 'Invoice'
  const createTabLabel = docConfig?.createTabLabel || `Create ${docTitle}`
  const previewTabLabel = docConfig?.previewTabLabel || 'Preview & Print'

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

      {/* Hero */}
      <div className="no-print bg-white border-b border-[var(--line)] py-10 px-4 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <img src="/logo.svg" alt="Logo" className="w-12 h-12 rounded-2xl" />
          <h1 className="text-[28px] font-bold text-[var(--ink)] tracking-tight">
            {docConfig?.heroTitle || 'Invoice Generator'}
          </h1>
        </div>
        <p className="text-[var(--muted)] text-[15px] leading-relaxed max-w-md mx-auto">
          {docConfig?.heroDesc || 'Create professional invoices in minutes.'}
        </p>
      </div>

      {/* Tab bar */}
      <div className="no-print bg-[#f7f8fa] border-b border-[var(--line)] px-4 py-3">
        <div className="max-w-[920px] mx-auto">
          <div className="bg-white border border-[var(--line)] rounded-xl p-1 flex">
            <button
              onClick={() => setActiveTab('create')}
              className={`flex-1 py-2.5 text-[13.5px] font-semibold rounded-lg transition-all ${
                activeTab === 'create'
                  ? 'bg-[var(--ink)] text-white shadow-sm'
                  : 'text-[var(--muted)] hover:text-[var(--ink)]'
              }`}
            >
              {createTabLabel}
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex-1 py-2.5 text-[13.5px] font-semibold rounded-lg transition-all ${
                activeTab === 'preview'
                  ? 'bg-[var(--ink)] text-white shadow-sm'
                  : 'text-[var(--muted)] hover:text-[var(--ink)]'
              }`}
            >
              {previewTabLabel}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-[#f7f8fa] min-h-screen">
        {activeTab === 'create' ? (
          <>
            {docConfig?.docTitle === 'Quote' ? (
              <QuoteForm
                invoice={invoice}
                onChange={onChange}
                onSetField={set}
                onNew={onNew}
                onPreview={() => setActiveTab('preview')}
                errors={errors}
                docConfig={docConfig}
              />
            ) : docConfig?.docTitle === 'Purchase Order' ? (
              <POForm
                invoice={invoice}
                onChange={onChange}
                onSetField={set}
                onNew={onNew}
                onPreview={() => setActiveTab('preview')}
                errors={errors}
                docConfig={docConfig}
              />
            ) : (
              <InvoiceForm
                invoice={invoice}
                onChange={onChange}
                onSetField={set}
                onNew={onNew}
                onPreview={() => setActiveTab('preview')}
                errors={errors}
                docConfig={docConfig}
              />
            )}

            {/* How to Use guide */}
            {docConfig?.howToSteps && (
              <div className="no-print max-w-[920px] mx-auto px-4 pb-20">
                <h2 className="text-[24px] font-bold text-[var(--ink)] mb-2 text-center">
                  {docConfig.howToTitle}
                </h2>
                <p className="text-[var(--muted)] text-[15px] text-center mb-8">
                  Follow these steps to create and send a professional invoice in minutes — no account needed.
                </p>
                <div className="space-y-4">
                  {docConfig.howToSteps.map((step, i) => (
                    <div key={i} className="bg-white rounded-xl border border-[var(--line)] p-5 flex gap-4 items-start">
                      <div className="shrink-0 w-8 h-8 rounded-full bg-[var(--accent)] text-white font-bold text-[14px] flex items-center justify-center">
                        {i + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold text-[var(--ink)] text-[14.5px] mb-1">{step.title}</h3>
                        <p className="text-[var(--muted)] text-[13.5px] leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="px-4 py-8 pb-20">
            <InvoiceSheet
              ref={sheetRef}
              invoice={invoice}
              totals={totals}
              errors={errors}
              onChange={onChange}
              onSetField={set}
              docConfig={docConfig}
            />
            <div className="max-w-[820px] mx-auto mt-4 flex gap-3">
              <button
                onClick={() => setActiveTab('create')}
                className="flex-1 py-3 border border-[var(--line)] bg-white text-[var(--ink)] font-semibold text-[14px] rounded-lg hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
              >
                ← Back to Edit
              </button>
              <button
                onClick={handleDownloadPdf}
                className="flex-1 py-3 bg-[var(--ink)] text-white font-bold text-[14px] rounded-lg hover:bg-[#2a3142] transition-colors"
              >
                Download PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
