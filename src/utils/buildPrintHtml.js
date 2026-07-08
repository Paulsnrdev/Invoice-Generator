import { formatMoney } from './formatting'
import { calcTotals } from './calculations'

// Returns a self-contained <div> string (no html/head/body wrapper).
// All styles are inline so html2canvas can render it without external CSS.
export function buildPrintHtml(invoice, docConfig = {}) {
  const {
    from, to, lineItems, discountPct, taxPct, currency,
    invoiceNumber, issueDate, dueDate, bankDetails, notes,
    paymentTerms, paymentMethods, lateFeePolicy, disputeResolution,
  } = invoice

  const {
    docTitle          = 'Invoice',
    numberLabel       = 'Invoice #',
    dueDateLabel      = 'Due date',
    billToLabel       = 'Bill to',
    paymentTermsLabel = 'Payment Terms',
  } = docConfig

  const fmt    = v => formatMoney(v, currency)
  const totals = calcTotals(lineItems, discountPct, taxPct)

  const ACCENT = '#0f766e'
  const INK    = '#14171f'
  const MUTED  = '#6b7280'
  const LINE   = '#e6e7eb'
  const FONT   = "Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"

  const logoHtml = from.logoBase64
    ? `<img src="${from.logoBase64}" style="max-height:56px;max-width:150px;object-fit:contain;display:block;margin-bottom:10px;" />`
    : ''

  const fromLines = [
    from.email,
    from.phone,
    from.address,
    from.taxNumber,
    from.businessLicense,
    from.website,
  ].filter(Boolean)
   .map(l => `<div style="color:${MUTED};font-size:12px;line-height:1.7;">${esc(l)}</div>`)
   .join('')

  const toLines = [to.email, to.address, to.phone, to.taxId]
    .filter(Boolean)
    .map(l => `<div style="color:${MUTED};font-size:12px;">${esc(l)}</div>`)
    .join('')

  const itemRows = lineItems.map(item => {
    const qty  = parseFloat(item.quantity) || 0
    const rate = parseFloat(item.rate)     || 0
    return `
      <tr>
        <td style="padding:9px 8px;border-bottom:1px solid ${LINE};font-size:13px;font-weight:500;color:${INK};">${esc(item.description)}</td>
        <td style="padding:9px 8px;border-bottom:1px solid ${LINE};text-align:right;font-size:13px;color:${INK};">${qty}</td>
        <td style="padding:9px 8px;border-bottom:1px solid ${LINE};text-align:right;font-size:13px;color:${INK};">${fmt(rate)}</td>
        <td style="padding:9px 8px;border-bottom:1px solid ${LINE};text-align:right;font-size:13px;font-weight:600;color:${INK};white-space:nowrap;">${fmt(qty * rate)}</td>
      </tr>`
  }).join('')

  const footerSection = (heading, content) =>
    content
      ? `<div style="margin-bottom:18px;">
           <div style="font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${MUTED};margin-bottom:5px;">${heading}</div>
           <div style="color:${MUTED};font-size:12px;line-height:1.7;white-space:pre-wrap;">${esc(content)}</div>
         </div>`
      : ''

  return `
<div style="font-family:${FONT};color:${INK};background:#fff;padding:48px 52px;max-width:780px;margin:0 auto;">

  <!-- Accent bar -->
  <div style="height:6px;background:${ACCENT};margin:-48px -52px 44px -52px;"></div>

  <!-- Header -->
  <div style="display:table;width:100%;margin-bottom:38px;">
    <div style="display:table-cell;vertical-align:top;width:55%;">
      ${logoHtml}
      <div style="font-size:19px;font-weight:700;letter-spacing:-.015em;margin-bottom:4px;">${esc(from.name)}</div>
      ${fromLines}
    </div>
    <div style="display:table-cell;vertical-align:top;text-align:right;">
      <div style="font-size:30px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;margin-bottom:14px;">${esc(docTitle)}</div>
      <table style="margin-left:auto;border-collapse:collapse;font-size:13px;">
        <tr>
          <td style="color:${MUTED};padding:2px 10px 2px 0;text-align:right;">${esc(numberLabel)}</td>
          <td style="text-align:right;min-width:110px;">${esc(invoiceNumber)}</td>
        </tr>
        <tr>
          <td style="color:${MUTED};padding:2px 10px 2px 0;text-align:right;">Issue date</td>
          <td style="text-align:right;">${esc(issueDate)}</td>
        </tr>
        <tr>
          <td style="color:${MUTED};padding:2px 10px 2px 0;text-align:right;">${esc(dueDateLabel)}</td>
          <td style="text-align:right;">${esc(dueDate)}</td>
        </tr>
      </table>
    </div>
  </div>

  <!-- Bill To -->
  <div style="margin-bottom:30px;">
    <div style="font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${MUTED};margin-bottom:5px;">${esc(billToLabel)}</div>
    <div style="font-weight:600;font-size:14px;color:${INK};">${esc(to.name)}</div>
    ${toLines}
  </div>

  <!-- Line Items -->
  <table style="width:100%;border-collapse:collapse;margin-bottom:6px;">
    <thead>
      <tr>
        <th style="text-align:left;font-size:10px;font-weight:700;letter-spacing:.09em;text-transform:uppercase;color:${MUTED};padding:0 8px 9px;border-bottom:2px solid ${INK};width:52%;">Description</th>
        <th style="text-align:right;font-size:10px;font-weight:700;letter-spacing:.09em;text-transform:uppercase;color:${MUTED};padding:0 8px 9px;border-bottom:2px solid ${INK};">Qty</th>
        <th style="text-align:right;font-size:10px;font-weight:700;letter-spacing:.09em;text-transform:uppercase;color:${MUTED};padding:0 8px 9px;border-bottom:2px solid ${INK};">Rate</th>
        <th style="text-align:right;font-size:10px;font-weight:700;letter-spacing:.09em;text-transform:uppercase;color:${MUTED};padding:0 8px 9px;border-bottom:2px solid ${INK};">Amount</th>
      </tr>
    </thead>
    <tbody>${itemRows}</tbody>
  </table>

  <!-- Totals -->
  <div style="display:table;width:100%;margin-top:6px;">
    <div style="display:table-cell;"></div>
    <div style="display:table-cell;width:290px;">
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        <tr>
          <td style="padding:7px 8px;color:${MUTED};">Subtotal</td>
          <td style="padding:7px 8px;text-align:right;">${fmt(totals.subtotal)}</td>
        </tr>
        ${discountPct > 0 ? `<tr>
          <td style="padding:7px 8px;color:${MUTED};">Discount (${discountPct}%)</td>
          <td style="padding:7px 8px;text-align:right;">–${fmt(totals.discount)}</td>
        </tr>` : ''}
        <tr>
          <td style="padding:7px 8px;color:${MUTED};">Tax / VAT (${taxPct}%)</td>
          <td style="padding:7px 8px;text-align:right;">${fmt(totals.tax)}</td>
        </tr>
        <tr style="border-top:2px solid ${INK};">
          <td style="padding:12px 8px 4px;font-size:17px;font-weight:800;">Total</td>
          <td style="padding:12px 8px 4px;font-size:17px;font-weight:800;text-align:right;color:${ACCENT};">${fmt(totals.grand)}</td>
        </tr>
      </table>
    </div>
  </div>

  <!-- Footer -->
  <div style="margin-top:38px;padding-top:22px;border-top:1px solid ${LINE};">
    ${footerSection('Payment Details', bankDetails)}
    ${footerSection(paymentTermsLabel, paymentTerms)}
    ${footerSection('Notes', notes)}
    ${footerSection('Accepted Payment Methods', paymentMethods)}
    ${footerSection('Late Fee Policy', lateFeePolicy)}
    ${footerSection('Dispute Resolution', disputeResolution)}
  </div>

  <div style="text-align:center;margin-top:36px;color:${MUTED};font-size:12px;letter-spacing:.02em;">Thank you!</div>
</div>`
}

function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
