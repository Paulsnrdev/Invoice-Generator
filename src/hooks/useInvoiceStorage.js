import { useState, useCallback } from 'react'

const STORAGE_KEY = 'invoiceapp_invoices'

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function save(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

export function useInvoiceStorage() {
  const [savedInvoices, setSavedInvoices] = useState(load)

  const saveInvoice = useCallback((invoice) => {
    setSavedInvoices(prev => {
      const existing = prev.findIndex(i => i.id === invoice.id)
      const updated = existing >= 0
        ? prev.map(i => i.id === invoice.id ? { ...invoice, updatedAt: new Date().toISOString() } : i)
        : [{ ...invoice, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...prev]
      save(updated)
      return updated
    })
  }, [])

  const deleteInvoice = useCallback((id) => {
    setSavedInvoices(prev => {
      const updated = prev.filter(i => i.id !== id)
      save(updated)
      return updated
    })
  }, [])

  const nextInvoiceNumber = useCallback(() => {
    const all = load()
    if (all.length === 0) return 'INV-0001'
    const nums = all
      .map(i => parseInt((i.invoiceNumber || '').replace(/\D/g, ''), 10))
      .filter(n => !isNaN(n))
    const max = nums.length > 0 ? Math.max(...nums) : 0
    return `INV-${String(max + 1).padStart(4, '0')}`
  }, [])

  return { savedInvoices, saveInvoice, deleteInvoice, nextInvoiceNumber }
}
