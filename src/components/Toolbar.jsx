import { CURRENCIES, getCurrencySymbol } from '../utils/formatting'

export default function Toolbar({ currency, onCurrencyChange, onNew, onSave, onDownloadPdf, onShowList, savedCount, saved }) {
  return (
    <div className="no-print sticky top-0 z-10 flex flex-wrap gap-2.5 items-center px-5 py-3.5 bg-[rgba(236,237,237,.88)] backdrop-blur border-b border-[var(--line)]">
      {/* Brand */}
      <div className="mr-auto flex items-center gap-2 font-bold tracking-tight">
        <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)]" />
        Invoice Generator
        <span className="text-[var(--muted)] font-normal text-[13px]">— fill in, then save PDF</span>
      </div>

      {/* Currency */}
      <label className="flex items-center gap-1.5 text-[13px] text-[var(--muted)]">
        Currency
        <select
          value={currency}
          onChange={e => onCurrencyChange(e.target.value)}
          className="text-[14px] rounded-lg border border-[var(--line-strong)] bg-white text-[var(--ink)] px-3 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--accent-soft)] focus:border-[var(--accent)] hover:border-[#a9adb7]"
        >
          {CURRENCIES.map(c => (
            <option key={c} value={c}>{getCurrencySymbol(c)} {c}</option>
          ))}
        </select>
      </label>

      <button
        onClick={onShowList}
        className="text-[14px] rounded-lg border border-[var(--line-strong)] bg-white text-[var(--ink)] px-3 py-2 cursor-pointer hover:border-[#a9adb7] focus:outline-none focus:ring-2 focus:ring-[var(--accent-soft)]"
      >
        Saved ({savedCount})
      </button>

      <button
        onClick={onNew}
        className="text-[14px] rounded-lg border border-[var(--line-strong)] bg-white text-[var(--ink)] px-3 py-2 cursor-pointer hover:border-[#a9adb7] focus:outline-none focus:ring-2 focus:ring-[var(--accent-soft)]"
      >
        New Invoice
      </button>

      <button
        onClick={onSave}
        className="text-[14px] rounded-lg border px-3 py-2 cursor-pointer font-semibold focus:outline-none focus:ring-2 transition-colors"
        style={saved
          ? { background: '#e6f2f0', borderColor: 'var(--accent)', color: 'var(--accent)' }
          : { background: 'white', borderColor: 'var(--line-strong)', color: 'var(--ink)' }
        }
      >
        {saved ? 'Saved ✓' : 'Save'}
      </button>

      <button
        onClick={onDownloadPdf}
        className="text-[14px] rounded-lg border border-[var(--accent)] bg-[var(--accent)] text-white px-3 py-2 cursor-pointer font-semibold hover:bg-[#0c5f58] hover:border-[#0c5f58] focus:outline-none focus:ring-2 focus:ring-[var(--accent-soft)]"
      >
        Download PDF
      </button>
    </div>
  )
}
