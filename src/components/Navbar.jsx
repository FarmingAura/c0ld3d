import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'

const links = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Payments', href: '#payments' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center">
      <nav
        className={`w-full transition-all duration-500 ease-out ${
          scrolled ? 'mt-3 max-w-3xl mx-4 md:mx-auto' : 'mt-0 max-w-6xl mx-4 md:mx-auto'
        }`}
      >
        <div
          className={`flex items-center justify-between transition-all duration-500 ease-out border ${
            scrolled
              ? 'bg-surface/80 backdrop-blur-xl border-line rounded-full px-5 py-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.4)]'
              : 'bg-transparent border-transparent px-2 py-5'
          }`}
        >
          <a href="#home" className="font-display font-semibold text-bone text-lg tracking-tight">
            c0ld3d
          </a>

          <ul className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="text-sm text-dim hover:text-bone transition-colors relative group"
                >
                  {l.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-signal transition-all duration-300 group-hover:w-full" />
                </a>
              </li>
            ))}
          </ul>

          <a
            href="#contact"
            className="hidden md:inline-flex items-center gap-2 text-sm text-ink bg-bone px-4 py-2 rounded-full font-medium hover:bg-signal hover:text-bone transition-colors"
          >
            Contact
          </a>

          <button
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="md:hidden text-bone p-1"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <div
        className={`fixed inset-0 bg-ink z-40 flex flex-col items-center justify-center gap-8 transition-all duration-500 md:hidden ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {links.map((l, i) => (
          <a
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            className="font-display text-3xl text-bone hover:text-signal transition-colors"
            style={{ transitionDelay: open ? `${i * 40}ms` : '0ms' }}
          >
            {l.label}
          </a>
        ))}
      </div>
    </header>
  )
}
