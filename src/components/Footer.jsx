import { profile } from '../data/site'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative px-6 md:px-12 py-10 border-t border-line">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <p className="font-display text-bone text-lg">c0ld3d</p>
          <p className="text-dim text-xs mono-tag mt-1">Building things with code.</p>
        </div>

        <div className="flex items-center gap-6 text-sm text-dim">
          <a href={profile.instagram.url} target="_blank" rel="noreferrer" className="hover:text-signal transition-colors">
            Instagram
          </a>
          <span className="text-line">/</span>
          <span>{profile.discord}</span>
          <span className="text-line">/</span>
          <a href={`mailto:${profile.email}`} className="hover:text-signal transition-colors">
            Email
          </a>
        </div>

        <p className="mono-tag text-[11px] text-dim">© {year} c0ld3d. All rights reserved.</p>
      </div>
    </footer>
  )
}
