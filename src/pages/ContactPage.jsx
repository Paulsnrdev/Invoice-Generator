import { useState } from 'react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      {/* Hero */}
      <div className="bg-white border-b border-[var(--line)] py-10 px-4 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <img src="/logo.svg" alt="Logo" className="w-12 h-12 rounded-2xl" />
          <h1 className="text-[28px] font-bold text-[var(--ink)] tracking-tight">Contact Us</h1>
        </div>
        <p className="text-[var(--muted)] text-[15px] max-w-md mx-auto">
          Have a question, feature request, or feedback? We'd love to hear from you.
        </p>
      </div>

      <div className="max-w-[620px] mx-auto px-4 py-14">
        {sent ? (
          <div className="bg-[var(--accent-soft)] border border-[#b2d8d4] rounded-xl p-8 text-center">
            <div className="text-4xl mb-3">✅</div>
            <h2 className="text-[20px] font-bold text-[var(--ink)] mb-2">Message sent!</h2>
            <p className="text-[var(--muted)] text-[14px]">Thanks for reaching out. We'll get back to you as soon as possible.</p>
            <button
              onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }) }}
              className="mt-5 px-5 py-2 rounded-lg bg-[var(--accent)] text-white text-[14px] font-semibold hover:bg-[#0c5f58]"
            >
              Send another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[var(--line)] p-8 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Your Name" type="text" placeholder="John Doe"
                value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} required />
              <Field label="Email Address" type="email" placeholder="john@example.com"
                value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} required />
            </div>
            <Field label="Subject" type="text" placeholder="What's this about?"
              value={form.subject} onChange={v => setForm(f => ({ ...f, subject: v }))} required />
            <div>
              <label className="block text-[13px] font-medium text-[var(--ink)] mb-1.5">Message</label>
              <textarea
                className="w-full border border-[var(--line-strong)] rounded-lg px-3.5 py-2.5 text-[14px] text-[var(--ink)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] resize-none"
                rows={5}
                placeholder="Tell us how we can help..."
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-[var(--accent)] text-white font-semibold text-[14px] hover:bg-[#0c5f58] transition-colors"
            >
              Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

function Field({ label, type, placeholder, value, onChange, required }) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-[var(--ink)] mb-1.5">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        required={required}
        className="w-full border border-[var(--line-strong)] rounded-lg px-3.5 py-2.5 text-[14px] text-[var(--ink)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
      />
    </div>
  )
}
