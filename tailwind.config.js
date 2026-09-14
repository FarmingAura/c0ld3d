/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#08090a',
        surface: '#0f1011',
        surface2: '#151617',
        line: '#232426',
        bone: '#f3f1ec',
        dim: '#8a8b8d',
        signal: '#e4322c',
        signal2: '#ff4a3f',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
    },
  },
  plugins: [],
}
