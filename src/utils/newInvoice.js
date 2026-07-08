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
    status: 'Draft',
    from: {
      name: '',
      email: '',
      phone: '',
      address: '',
      taxNumber: '',
      businessLicense: '',
      website: '',
      logoBase64: null,
    },
    to: {
      name: '',
      email: '',
      address: '',
      phone: '',
      taxId: '',
    },
    lineItems: [
      { id: uuidv4(), description: '', quantity: 1, rate: 0 },
    ],
    discountPct: 0,
    discountType: 'percentage',
    discountValue: 0,
    taxPct: 0,
    bankDetails: '',
    notes: '',
    shippingAddress: '',
    shippingCost: 0,
    authorizedBy: '',
    paymentTerms: '',
    paymentMethods: '',
    lateFeePolicy: '',
    disputeResolution: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}
