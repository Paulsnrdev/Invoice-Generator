import { useState } from 'react'

const LINKS = [
  { label: 'Invoice Generator', href: '#' },
  { label: 'Quote Generator',   href: '#' },
  { label: 'PO Generator',      href: '#' },
  { label: 'About Us',          href: '#' },
  { label: 'Contact Us',        href: '#' },
  { label: 'FAQ',               href: '#' },
]

export default function NavLinks() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="no-print bg-[#eef0f3] border-b border-[var(--line)]">
      {/* Desktop — single scrollable row */}
      <div className="hidden sm:flex items-center justify-center overflow-x-auto scrollbar-none px-4">
        {LINKS.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            className="shrink-0 px-5 py-3 text-[13.5px] font-medium text-[#3d4a5c] hover:text-[var(--accent)] hover:bg-white transition-colors whitespace-nowrap"
          >
            {label}
          </a>
        ))}
      </div>

      {/* Mobile — hamburger toggle */}
      <div className="sm:hidden flex items-center justify-between px-4 py-2.5">
        <span className="text-[13px] font-semibold text-[#3d4a5c]">Menu</span>
        <button
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle navigation"
          className="w-8 h-8 flex flex-col justify-center gap-[5px] items-center"
        >
          <span className={`block w-5 h-[2px] bg-[#3d4a5c] transition-transform origin-center ${open ? 'rotate-45 translate-y-[7px]' : ''}`} />
          <span className={`block w-5 h-[2px] bg-[#3d4a5c] transition-opacity ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-[2px] bg-[#3d4a5c] transition-transform origin-center ${open ? '-rotate-45 -translate-y-[7px]' : ''}`} />
        </button>
      </div>

      {open && (
        <div className="sm:hidden border-t border-[var(--line)] flex flex-col">
          {LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              onClick={() => setOpen(false)}
              className="px-5 py-3 text-[14px] font-medium text-[#3d4a5c] hover:text-[var(--accent)] hover:bg-white border-b border-[var(--line)] last:border-0 transition-colors"
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}
