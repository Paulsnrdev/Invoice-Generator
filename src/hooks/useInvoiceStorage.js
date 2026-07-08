import { useState, useCallback } from 'react'

function load(storageKey) {
  try {
    return JSON.parse(localStorage.getItem(storageKey) || '[]')
  } catch {
    return []
  }
}

function persist(storageKey, list) {
  localStorage.setItem(storageKey, JSON.stringify(list))
}

export function useInvoiceStorage(docConfig) {
  const { storageKey, numberPrefix } = docConfig

  const [savedInvoices, setSavedInvoices] = useState(() => load(storageKey))

  const saveInvoice = useCallback((invoice) => {
    setSavedInvoices(prev => {
      const existing = prev.findIndex(i => i.id === invoice.id)
      const updated = existing >= 0
        ? prev.map(i => i.id === invoice.id ? { ...invoice, updatedAt: new Date().toISOString() } : i)
        : [{ ...invoice, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...prev]
      persist(storageKey, updated)
      return updated
    })
  }, [storageKey])

  const deleteInvoice = useCallback((id) => {
    setSavedInvoices(prev => {
      const updated = prev.filter(i => i.id !== id)
      persist(storageKey, updated)
      return updated
    })
  }, [storageKey])

  const nextInvoiceNumber = useCallback(() => {
    const all = load(storageKey)
    if (all.length === 0) return `${numberPrefix}0001`
    const nums = all
      .map(i => parseInt((i.invoiceNumber || '').replace(/\D/g, ''), 10))
      .filter(n => !isNaN(n))
    const max = nums.length > 0 ? Math.max(...nums) : 0
    return `${numberPrefix}${String(max + 1).padStart(4, '0')}`
  }, [storageKey, numberPrefix])

  return { savedInvoices, saveInvoice, deleteInvoice, nextInvoiceNumber }
}
