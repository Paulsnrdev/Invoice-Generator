export function calcSubtotal(lineItems) {
  return lineItems.reduce((sum, item) => {
    const qty = parseFloat(item.quantity) || 0
    const rate = parseFloat(item.rate) || 0
    return sum + qty * rate
  }, 0)
}

export function calcTotals(lineItems, discountPct, taxPct) {
  const subtotal = calcSubtotal(lineItems)
  const discountPctSafe = Math.min(100, Math.max(0, parseFloat(discountPct) || 0))
  const taxPctSafe = Math.max(0, parseFloat(taxPct) || 0)
  const discount = subtotal * (discountPctSafe / 100)
  const afterDiscount = subtotal - discount
  const tax = afterDiscount * (taxPctSafe / 100)
  const grand = afterDiscount + tax
  return { subtotal, discount, tax, grand }
}
