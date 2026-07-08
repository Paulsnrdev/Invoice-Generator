import { formatMoney } from './formatting'
import { calcTotals } from './calculations'

export function buildPrintHtml(invoice) {
  const { from, to, lineItems, discountPct, taxPct, currency, invoiceNumber, issueDate, dueDate, bankDetails, notes } = invoice
  const fmt = v => formatMoney(v, currency)
  const totals = calcTotals(lineItems, discountPct, taxPct)

  const logoHtml = from.logoBase64
    ? `<img src="${from.logoBase64}" style="max-height:60px;max-width:160px;object-fit:contain;margin-bottom:10px;display:block;" />`
    : ''

  const fromLines = [from.email, from.phone, from.address, from.taxNumber]
    .filter(Boolean)
    .map(l => `<div style="color:#6b7280;font-size:13px;line-height:1.6;">${esc(l)}</div>`)
    .join('')

  const itemRows = lineItems.map(item => {
    const qty = parseFloat(item.quantity) || 0
    const rate = parseFloat(item.rate) || 0
    const amount = qty * rate
    return `<tr>
      <td style="padding:10px 8px;border-bottom:1px solid #e6e7eb;font-size:13.5px;font-weight:500;">${esc(item.description)}</td>
      <td style="padding:10px 8px;border-bottom:1px solid #e6e7eb;text-align:right;font-size:13.5px;font-variant-numeric:tabular-nums;">${qty}</td>
      <td style="padding:10px 8px;border-bottom:1px solid #e6e7eb;text-align:right;font-size:13.5px;font-variant-numeric:tabular-nums;">${fmt(rate)}</td>
      <td style="padding:10px 8px;border-bottom:1px solid #e6e7eb;text-align:right;font-size:13.5px;font-weight:600;font-variant-numeric:tabular-nums;white-space:nowrap;">${fmt(amount)}</td>
    </tr>`
  }).join('')

  const discountRow = totals.discount > 0
    ? `<tr><td style="${totalLabelStyle}">Discount (${discountPct}%)</td><td style="${totalValueStyle}">–${fmt(totals.discount)}</td></tr>`
    : `<tr><td style="${totalLabelStyle}">Discount</td><td style="${totalValueStyle}">${fmt(0)}</td></tr>`

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #14171f; background: #fff; font-size: 14px; line-height: 1.5; -webkit-font-smoothing: antialiased; }
</style>
</head>
<body>
<div style="max-width:780px;margin:0 auto;padding:48px 52px;background:#fff;">

  <!-- Accent bar -->
  <div style="height:6px;background:#0f766e;margin:-48px -52px 48px;"></div>

  <!-- Header -->
  <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:24px;margin-bottom:40px;">
    <!-- From -->
    <div style="max-width:300px;">
      ${logoHtml}
      <div style="font-size:20px;font-weight:700;letter-spacing:-.015em;margin-bottom:4px;">${esc(from.name)}</div>
      ${fromLines}
    </div>
    <!-- Doc title -->
    <div style="text-align:right;">
      <div style="font-size:32px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;margin-bottom:14px;">Invoice</div>
      <table style="margin-left:auto;font-size:13px;border-spacing:0;">
        <tr>
          <td style="color:#6b7280;padding:3px 12px 3px 0;text-align:right;">Invoice #</td>
          <td style="font-variant-numeric:tabular-nums;text-align:right;min-width:120px;">${esc(invoiceNumber)}</td>
        </tr>
        <tr>
          <td style="color:#6b7280;padding:3px 12px 3px 0;text-align:right;">Issue date</td>
          <td style="font-variant-numeric:tabular-nums;text-align:right;">${esc(issueDate)}</td>
        </tr>
        <tr>
          <td style="color:#6b7280;padding:3px 12px 3px 0;text-align:right;">Due date</td>
          <td style="font-variant-numeric:tabular-nums;text-align:right;">${esc(dueDate)}</td>
        </tr>
      </table>
    </div>
  </div>

  <!-- Bill To -->
  <div style="margin-bottom:32px;">
    <div style="font-size:11px;font-weight:600;letter-spacing:.09em;text-transform:uppercase;color:#6b7280;margin-bottom:6px;">Bill to</div>
    <div style="font-weight:600;font-size:15px;">${esc(to.name)}</div>
    ${to.email ? `<div style="color:#6b7280;font-size:13px;">${esc(to.email)}</div>` : ''}
    ${to.address ? `<div style="color:#6b7280;font-size:13px;">${esc(to.address)}</div>` : ''}
  </div>

  <!-- Line Items -->
  <table style="width:100%;border-collapse:collapse;margin-bottom:8px;">
    <thead>
      <tr>
        <th style="text-align:left;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#6b7280;padding:0 8px 10px;border-bottom:1.5px solid #14171f;width:52%;">Description</th>
        <th style="text-align:right;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#6b7280;padding:0 8px 10px;border-bottom:1.5px solid #14171f;">Qty</th>
        <th style="text-align:right;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#6b7280;padding:0 8px 10px;border-bottom:1.5px solid #14171f;">Rate</th>
        <th style="text-align:right;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#6b7280;padding:0 8px 10px;border-bottom:1.5px solid #14171f;">Amount</th>
      </tr>
    </thead>
    <tbody>${itemRows}</tbody>
  </table>

  <!-- Totals -->
  <div style="display:flex;justify-content:flex-end;margin-top:8px;">
    <table style="width:300px;border-spacing:0;">
      <tr><td style="${totalLabelStyle}">Subtotal</td><td style="${totalValueStyle}">${fmt(totals.subtotal)}</td></tr>
      ${discountRow}
      <tr><td style="${totalLabelStyle}">Tax / VAT (${taxPct}%)</td><td style="${totalValueStyle}">${fmt(totals.tax)}</td></tr>
      <tr>
        <td style="padding:12px 8px 4px;font-size:18px;font-weight:800;border-top:2px solid #14171f;">Total</td>
        <td style="padding:12px 8px 4px;font-size:18px;font-weight:800;text-align:right;color:#0f766e;font-variant-numeric:tabular-nums;border-top:2px solid #14171f;">${fmt(totals.grand)}</td>
      </tr>
    </table>
  </div>

  <!-- Footer -->
  <div style="margin-top:40px;padding-top:24px;border-top:1px solid #e6e7eb;display:flex;gap:32px;">
    <div style="flex:1;">
      <div style="font-size:11px;font-weight:600;letter-spacing:.09em;text-transform:uppercase;color:#6b7280;margin-bottom:6px;">Payment details</div>
      <div style="color:#6b7280;font-size:13px;white-space:pre-wrap;">${esc(bankDetails)}</div>
    </div>
    <div style="flex:1;">
      <div style="font-size:11px;font-weight:600;letter-spacing:.09em;text-transform:uppercase;color:#6b7280;margin-bottom:6px;">Notes / terms</div>
      <div style="color:#6b7280;font-size:13px;white-space:pre-wrap;">${esc(notes)}</div>
    </div>
  </div>

  <div style="text-align:center;margin-top:40px;color:#6b7280;font-size:13px;letter-spacing:.02em;">Thank you!</div>
</div>
</body>
</html>`
}

const totalLabelStyle = 'padding:8px 8px;color:#6b7280;font-size:13.5px;font-variant-numeric:tabular-nums;'
const totalValueStyle = 'padding:8px 8px;text-align:right;font-size:13.5px;font-variant-numeric:tabular-nums;'

function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
