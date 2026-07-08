import { CURRENCIES, getCurrencySymbol } from '../utils/formatting'

export default function Toolbar({ currency, onCurrencyChange, onNew, onSave, onDownloadPdf, onShowList, savedCount, saved }) {
  return (
    <div className="no-print bg-[rgba(236,237,237,.92)] backdrop-blur border-b border-[var(--line)] px-5 py-2.5 flex flex-wrap gap-2 items-center sticky top-14 z-10">
      <div className="mr-auto" />

      <label className="flex items-center gap-1.5 text-[13px] text-[var(--muted)]">
        Currency
        <select
          value={currency}
          onChange={e => onCurrencyChange(e.target.value)}
          className="text-[13.5px] rounded-lg border border-[var(--line-strong)] bg-white text-[var(--ink)] px-2.5 py-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--accent-soft)] focus:border-[var(--accent)] hover:border-[#a9adb7]"
        >
          {CURRENCIES.map(c => (
            <option key={c} value={c}>{getCurrencySymbol(c)} {c}</option>
          ))}
        </select>
      </label>

      <button
        onClick={onShowList}
        className="text-[13.5px] rounded-lg border border-[var(--line-strong)] bg-white text-[var(--ink)] px-3 py-1.5 hover:border-[#a9adb7] focus:outline-none focus:ring-2 focus:ring-[var(--accent-soft)]"
      >
        Saved ({savedCount})
      </button>

      <button
        onClick={onNew}
        className="text-[13.5px] rounded-lg border border-[var(--line-strong)] bg-white text-[var(--ink)] px-3 py-1.5 hover:border-[#a9adb7] focus:outline-none focus:ring-2 focus:ring-[var(--accent-soft)]"
      >
        New
      </button>

      <button
        onClick={onSave}
        className="text-[13.5px] rounded-lg border px-3 py-1.5 font-semibold focus:outline-none focus:ring-2 transition-colors"
        style={saved
          ? { background: '#e6f2f0', borderColor: 'var(--accent)', color: 'var(--accent)' }
          : { background: 'white', borderColor: 'var(--line-strong)', color: 'var(--ink)' }
        }
      >
        {saved ? 'Saved ✓' : 'Save'}
      </button>

      <button
        onClick={onDownloadPdf}
        className="text-[13.5px] rounded-lg border border-[var(--accent)] bg-[var(--accent)] text-white px-3 py-1.5 font-semibold hover:bg-[#0c5f58] hover:border-[#0c5f58] focus:outline-none focus:ring-2 focus:ring-[var(--accent-soft)]"
      >
        Download PDF
      </button>
    </div>
  )
}
