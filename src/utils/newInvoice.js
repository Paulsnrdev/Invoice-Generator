import { v4 as uuidv4 } from 'uuid'
import { isoDate, addDays } from './formatting'

export function createBlankInvoice(invoiceNumber = 'INV-0001') {
  const today = isoDate()
  return {
    id: uuidv4(),
    invoiceNumber,
    issueDate: today,
    dueDate: addDays(today, 14),
    currency: 'NGN',
    from: {
      name: '',
      email: '',
      phone: '',
      address: '',
      taxNumber: '',
      logoBase64: null,
    },
    to: {
      name: '',
      email: '',
      address: '',
    },
    lineItems: [
      { id: uuidv4(), description: '', quantity: 1, rate: 0 },
    ],
    discountPct: 0,
    taxPct: 0,
    bankDetails: '',
    notes: 'Payment due within 14 days. Thank you for your business.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}
