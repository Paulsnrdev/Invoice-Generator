import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { NAV_LINKS } from '../config/docTypes'

export default function Navbar() {
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="no-print bg-white border-b border-[var(--line)] sticky top-0 z-20">
      <div className="px-6 flex items-center h-14 max-w-[1200px] mx-auto">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 mr-8 hover:opacity-90 transition-opacity">
          <img src="/logo.svg" alt="Logo" className="w-8 h-8 rounded-lg" />
          <span className="font-bold text-[var(--ink)] text-[16px]">Invoice Generator Online</span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-1 ml-auto">
          {NAV_LINKS.map(({ label, path }) => {
            const active = pathname === path
            return (
              <Link
                key={path}
                to={path}
                className={`px-3.5 py-2 text-[13.5px] font-medium rounded-md whitespace-nowrap transition-colors
                  ${active
                    ? 'text-[var(--accent)] bg-[var(--accent-soft)]'
                    : 'text-[#3d4a5c] hover:text-[var(--accent)] hover:bg-[var(--accent-soft)]'
                  }`}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
          className="md:hidden ml-auto flex flex-col gap-[5px] justify-center w-8 h-8"
        >
          <span className={`block w-5 h-[2px] bg-[var(--ink)] transition-transform origin-center ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
          <span className={`block w-5 h-[2px] bg-[var(--ink)] transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-[2px] bg-[var(--ink)] transition-transform origin-center ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-[var(--line)] pb-2">
          {NAV_LINKS.map(({ label, path }) => {
            const active = pathname === path
            return (
              <Link
                key={path}
                to={path}
                onClick={() => setMenuOpen(false)}
                className={`block px-5 py-3 text-[14px] font-medium border-b border-[var(--line)] last:border-0 transition-colors
                  ${active ? 'text-[var(--accent)] bg-[var(--accent-soft)]' : 'text-[#3d4a5c] hover:text-[var(--accent)] hover:bg-[var(--accent-soft)]'}`}
              >
                {label}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
