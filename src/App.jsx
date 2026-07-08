import { useState, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useInvoiceStorage } from './hooks/useInvoiceStorage'
import { createBlankInvoice } from './utils/newInvoice'
import { INVOICE_CONFIG } from './config/docTypes'
import InvoiceEditor from './components/InvoiceEditor'
import SavedInvoicesList from './components/SavedInvoicesList'

export default function App({ docConfig = INVOICE_CONFIG }) {
  const { savedInvoices, saveInvoice, deleteInvoice, nextInvoiceNumber } = useInvoiceStorage(docConfig)
  const [current, setCurrent] = useState(() => createBlankInvoice(`${docConfig.numberPrefix}0001`))
  const [view, setView] = useState('editor')

  const handleNew = useCallback(() => {
    setCurrent(createBlankInvoice(nextInvoiceNumber()))
    setView('editor')
  }, [nextInvoiceNumber])

  const handleSave = useCallback(() => {
    saveInvoice(current)
  }, [current, saveInvoice])

  const handleOpen = useCallback((invoice) => {
    setCurrent({ ...invoice })
    setView('editor')
  }, [])

  const handleDuplicate = useCallback((invoice) => {
    const dupe = {
      ...invoice,
      id: uuidv4(),
      invoiceNumber: nextInvoiceNumber(),
    }
    setCurrent(dupe)
    setView('editor')
  }, [nextInvoiceNumber])

  return (
    <div className="min-h-screen bg-[#eceded]">
      {view === 'editor' ? (
        <InvoiceEditor
          invoice={current}
          onChange={setCurrent}
          onSave={handleSave}
          onNew={handleNew}
          onShowList={() => setView('list')}
          savedCount={savedInvoices.length}
          docConfig={docConfig}
        />
      ) : (
        <SavedInvoicesList
          invoices={savedInvoices}
          onOpen={handleOpen}
          onDuplicate={handleDuplicate}
          onDelete={deleteInvoice}
          onNew={handleNew}
          onBack={() => setView('editor')}
          docConfig={docConfig}
        />
      )}
    </div>
  )
}
