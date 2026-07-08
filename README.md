# Invoice Generator

A clean, browser-only invoice generator built with React + Vite + Tailwind CSS. No backend, no login, just fill in your details, save locally, and download a PDF.

## Setup

```bash
npm install
npm run dev      # → http://localhost:5173
npm run build    # production build in /dist
```

## Features

- **Editable invoice** — click any field to edit inline
- **Logo upload** — drag-drop or pick an image; stored as base64
- **Dynamic line items** — add / remove rows, amounts auto-calculate
- **Live totals** — subtotal, discount %, tax/VAT %, and grand total update instantly
- **Currency selector** — NGN ₦, USD $, EUR €, GBP £, GHS GH₵, KES, ZAR, CAD
- **Download PDF** — uses html2pdf.js; exports only the invoice, not the UI
- **Save & load** — invoices stored in `localStorage`; reopen, duplicate, or delete
- **Auto-increment** — "New Invoice" bumps to the next `INV-XXXX` automatically
- **Print-ready** — `Ctrl/Cmd + P` produces a tidy document with no buttons visible
- **Input validation** — inline error messages for missing client name / empty descriptions

## Deploy

```bash
npm run build
# Drop the /dist folder onto Vercel or Netlify — zero config needed
```

## Notes

- Data lives in your browser's `localStorage`. Clearing site data removes saved invoices.
- To share invoices across devices you'd need a backend (out of scope for this version).
