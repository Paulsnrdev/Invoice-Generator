export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f7f8fa] py-10 px-4">
      <div className="max-w-[860px] mx-auto">

        {/* Main card */}
        <div className="bg-white rounded-xl border border-[var(--line)] p-10 mb-6">
          <h1 className="text-[30px] font-bold text-[var(--ink)] mb-6">About Invoice Generator Online</h1>

          <p className="text-[var(--muted)] text-[15px] leading-relaxed mb-5">
            Invoice Generator Online is a free, browser-based toolkit that helps freelancers, small
            business owners, and procurement teams create professional financial documents in seconds —
            no sign-up, no subscription, no hassle.
          </p>

          <p className="text-[var(--muted)] text-[15px] leading-relaxed mb-5">
            Whether you need to bill a client, send a price quote, or raise a purchase order with a
            supplier, our tools are purpose-built to make the job fast and straightforward. Fill in your
            details, preview the document, and download a print-ready PDF — all from your browser.
          </p>

          <p className="text-[var(--muted)] text-[15px] leading-relaxed">
            We built this because most invoicing tools are either overpriced, overcomplicated, or
            require you to hand over your business data to a third-party server. Everything on Invoice
            Generator Online runs locally in your browser. Your data never leaves your device.
          </p>
        </div>

        {/* What you can create */}
        <div className="bg-white rounded-xl border border-[var(--line)] p-10 mb-6">
          <h2 className="text-[20px] font-bold text-[var(--ink)] mb-5">What You Can Create</h2>

          <div className="space-y-5">
            <div className="flex gap-4 items-start">
              <div className="shrink-0 w-10 h-10 rounded-lg bg-[var(--accent-soft)] flex items-center justify-center">
                <svg className="w-5 h-5 text-[var(--accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-[var(--ink)] text-[14.5px] mb-1">Invoices</h3>
                <p className="text-[var(--muted)] text-[13.5px] leading-relaxed">
                  Create itemised invoices with your logo, client details, line items, tax, discount, bank
                  details, and payment terms. Auto-incrementing invoice numbers keep you organised.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="shrink-0 w-10 h-10 rounded-lg bg-[var(--accent-soft)] flex items-center justify-center">
                <svg className="w-5 h-5 text-[var(--accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-[var(--ink)] text-[14.5px] mb-1">Quotes</h3>
                <p className="text-[var(--muted)] text-[13.5px] leading-relaxed">
                  Send professional price quotes with a validity date, flexible discount options
                  (percentage or fixed amount), and a Terms & Conditions section — ready to convert
                  to an invoice once approved.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="shrink-0 w-10 h-10 rounded-lg bg-[var(--accent-soft)] flex items-center justify-center">
                <svg className="w-5 h-5 text-[var(--accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-[var(--ink)] text-[14.5px] mb-1">Purchase Orders</h3>
                <p className="text-[var(--muted)] text-[13.5px] leading-relaxed">
                  Generate purchase orders with buyer and vendor details, itemised product lines, tax,
                  shipping costs, delivery dates, and an authorised-by signature field — everything
                  your procurement workflow needs.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Key features */}
        <div className="bg-white rounded-xl border border-[var(--line)] p-10 mb-6">
          <h2 className="text-[20px] font-bold text-[var(--ink)] mb-5">Key Features</h2>
          <ul className="space-y-3">
            {[
              'Instant PDF download — no plugins or installs required',
              'Auto-save to browser storage — your documents persist between sessions',
              'Multi-currency support including NGN, USD, EUR, GBP, and more',
              'Upload your company logo for branded, professional documents',
              'Auto-incrementing document numbers so you never duplicate or skip',
              '100% private — no account, no server, no data collection',
              'Works on desktop and mobile browsers',
            ].map(item => (
              <li key={item} className="flex items-start gap-3 text-[13.5px] text-[var(--muted)]">
                <svg className="w-4 h-4 mt-[1px] shrink-0 text-[var(--accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Privacy note */}
        <div className="bg-white rounded-xl border border-[var(--line)] p-10">
          <h2 className="text-[20px] font-bold text-[var(--ink)] mb-4">Privacy &amp; Data</h2>
          <p className="text-[var(--muted)] text-[15px] leading-relaxed mb-4">
            Invoice Generator Online is built with privacy as a first principle. We do not have a
            server that stores your invoices, client names, or financial figures. Everything you
            enter — business details, client information, line items — is saved only in your
            browser's local storage and stays on your device.
          </p>
          <p className="text-[var(--muted)] text-[15px] leading-relaxed">
            When you download a PDF, it is generated entirely in your browser using the html2pdf
            library. No file is uploaded anywhere. You can use the tool on a completely air-gapped
            machine if you like.
          </p>
        </div>

      </div>
    </div>
  )
}
