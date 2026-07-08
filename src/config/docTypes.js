export const INVOICE_CONFIG = {
  docTitle: 'Invoice',
  numberLabel: 'Invoice #',
  numberPrefix: 'INV-',
  dueDateLabel: 'Due date',
  billToLabel: 'Bill to',
  storageKey: 'invoiceapp_invoices',
  heroTitle: 'Invoice Generator',
  heroDesc: 'Create professional invoices in minutes. Add your business details, client information, and line items to generate beautiful invoices.',
  path: '/',
  howToTitle: 'How to Use Our Free Invoice Generator',
  howToSteps: [
    {
      title: 'Upload Your Company Logo',
      desc: 'In the "Your Business Details" section, click "Choose File" to upload your logo. It will appear on the invoice and in the downloaded PDF. Supported formats: PNG, JPG, SVG.',
    },
    {
      title: 'Fill in Your Business Details',
      desc: 'Enter your company name, address, email, phone, and Tax ID / EIN. You can also add an optional Business License number and Website. These details appear on every invoice you send.',
    },
    {
      title: "Add Your Client's Information",
      desc: 'Fill in the "Bill To" section with your client\'s name, address, email, phone, and Tax ID. The client name is required before you can save the invoice.',
    },
    {
      title: 'Set the Invoice Number & Dates',
      desc: 'The invoice number auto-increments with each new invoice (e.g. INV-0001, INV-0002). Set the issue date and due date so your client knows exactly when payment is expected.',
    },
    {
      title: 'Add Line Items',
      desc: 'Click "Add Item" to list your services or products. Enter a description, quantity, and rate for each — the line total and grand total calculate automatically in real time.',
    },
    {
      title: 'Set the Tax Rate',
      desc: 'Enter your applicable tax or VAT rate (%) in the Tax Rate field. The subtotal, tax amount, and total all update instantly. Leave it at 0 if no tax applies.',
    },
    {
      title: 'Add Notes, Payment Terms & Legal Info',
      desc: 'Use "Additional Notes" for project details or special instructions. Add payment terms, accepted payment methods, a late fee policy, and a dispute resolution process in the sections below.',
    },
    {
      title: 'Preview & Download as PDF',
      desc: 'Click "Preview Invoice" to see the finished document, or switch to the "Preview & Print" tab. When ready, click "Save" to store it in your browser or "Download PDF" to export a print-ready file.',
    },
  ],
}

export const QUOTE_CONFIG = {
  docTitle: 'Quote',
  numberLabel: 'Quote #',
  numberPrefix: 'QT-',
  dueDateLabel: 'Valid until',
  billToLabel: 'Bill to',
  paymentTermsLabel: 'Terms & Conditions',
  storageKey: 'invoiceapp_quotes',
  heroTitle: 'Quote Generator',
  heroDesc: 'Create professional quotes in minutes. Add your business details, client information, and pricing to send accurate, branded quotes.',
  path: '/quote-generator',
}

export const PO_CONFIG = {
  docTitle: 'Purchase Order',
  numberLabel: 'PO #',
  numberPrefix: 'PO-',
  dueDateLabel: 'Delivery date',
  billToLabel: 'Vendor / Supplier',
  createTabLabel: 'Editor',
  previewTabLabel: 'Preview',
  storageKey: 'invoiceapp_pos',
  heroTitle: 'Purchase Order Generator',
  heroDesc: 'Create professional purchase orders in minutes. Add vendor details, quantities, and delivery dates to keep procurement on track.',
  path: '/po-generator',
}

export const NAV_LINKS = [
  { label: 'Invoice Generator', path: '/' },
  { label: 'Quote Generator',   path: '/quote-generator' },
  { label: 'PO Generator',      path: '/po-generator' },
  { label: 'About Us',          path: '/about' },
  { label: 'Contact Us',        path: '/contact' },
  { label: 'FAQ',               path: '/faq' },
]
