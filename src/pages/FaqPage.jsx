import { useState } from 'react'

const FAQS = [
  {
    q: 'Is Invoice Generator Online free to use?',
    a: 'Yes, completely free. There are no subscriptions, no hidden fees, and no account required. All tools are available in your browser at no cost.',
  },
  {
    q: 'Where is my data stored?',
    a: 'All your documents are saved locally in your browser\'s localStorage. Nothing is sent to a server. Your data stays on your device and is fully private.',
  },
  {
    q: 'Can I download my invoice as a PDF?',
    a: 'Yes. Click the "Download PDF" button in the toolbar to generate a professional PDF of your current document. It works entirely in your browser — no server processing needed.',
  },
  {
    q: 'Does it work offline?',
    a: 'Yes. Once the page is loaded, you can use all the tools without an internet connection. The PDF export also works offline.',
  },
  {
    q: 'What currencies are supported?',
    a: 'We support a wide range of currencies including NGN (₦), USD ($), EUR (€), GBP (£), KES, GHS, ZAR, and many more. Select your currency from the toolbar dropdown.',
  },
  {
    q: 'Can I add my company logo?',
    a: 'Yes. Click the "+ Upload logo" button in the "From" section of any document. The logo is stored as a base64 image and will appear in your PDF export.',
  },
  {
    q: 'What\'s the difference between an Invoice, Quote, and Purchase Order?',
    a: 'A Quote is sent before work begins, showing estimated costs. An Invoice is sent after work is complete, requesting payment. A Purchase Order is issued by a buyer to a vendor to authorize a purchase.',
  },
  {
    q: 'Can I edit a saved document?',
    a: 'Yes. Go to "Saved" in the toolbar, find your document, and click "Open". You can then make changes and save it again — it will update the existing record.',
  },
  {
    q: 'Will my saved documents be lost if I clear my browser data?',
    a: 'Yes. Since data is stored in localStorage, clearing your browser storage or cookies will delete your saved documents. We recommend exporting important documents as PDFs.',
  },
  {
    q: 'Can I duplicate a document?',
    a: 'Yes. In the saved documents list, click "Duplicate" on any document. A copy will be created with a new auto-incremented number, ready to edit.',
  },
]

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-[var(--line)] last:border-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-4 text-left gap-4"
      >
        <span className="text-[14.5px] font-semibold text-[var(--ink)]">{q}</span>
        <span className={`shrink-0 text-[var(--muted)] transition-transform text-lg leading-none ${open ? 'rotate-45' : ''}`}>+</span>
      </button>
      {open && (
        <p className="text-[13.5px] text-[var(--muted)] leading-relaxed pb-4">{a}</p>
      )}
    </div>
  )
}

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      {/* Hero */}
      <div className="bg-white border-b border-[var(--line)] py-10 px-4 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <img src="/logo.svg" alt="Logo" className="w-12 h-12 rounded-2xl" />
          <h1 className="text-[28px] font-bold text-[var(--ink)] tracking-tight">FAQ</h1>
        </div>
        <p className="text-[var(--muted)] text-[15px] max-w-md mx-auto">
          Answers to the most common questions about Invoice Generator Online.
        </p>
      </div>

      <div className="max-w-[700px] mx-auto px-4 py-12">
        <div className="bg-white rounded-xl border border-[var(--line)] px-6">
          {FAQS.map(({ q, a }) => (
            <FaqItem key={q} q={q} a={a} />
          ))}
        </div>
      </div>
    </div>
  )
}
