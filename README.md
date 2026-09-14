# c0ld3d — Portfolio

A premium, animated developer portfolio built with React, Vite, Tailwind CSS, GSAP and Lenis.

## Run it

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## Where to edit content

- `src/data/site.js` — name, tagline, about facts, skills, experience timeline, services, stats, contact info.
- `src/data/projects.js` — your project list. Add/remove objects freely; the grid updates automatically.
- `public/favicon.svg` — swap for your own mark if you want.

## Structure

```
src/
  components/        shared UI (Navbar, Footer, Cursor, Background, SmoothScroll)
  components/sections/  each homepage section (Hero, About, Skills, Experience, Services, Projects, Stats, Contact)
  data/              editable content files
  lib/               GSAP/ScrollTrigger setup
```

## Notes

- Respects `prefers-reduced-motion` — animations are skipped/simplified automatically.
- Custom cursor auto-disables on touch devices.
- Colors, type and spacing are all controlled via `tailwind.config.js`.
