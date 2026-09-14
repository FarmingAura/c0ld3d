import { lazy, Suspense, useState } from 'react'
import SmoothScroll from './components/SmoothScroll'
import Cursor from './components/Cursor'
import Background from './components/Background'
import Navbar from './components/Navbar'
import Intro from './intro/Intro'
import Hero from './components/sections/Hero'
import About from './components/sections/About'
import Skills from './components/sections/Skills'
import Experience from './components/sections/Experience'
import Services from './components/sections/Services'
import PaymentProofs from './components/sections/PaymentProofs'
import Stats from './components/sections/Stats'
import Contact from './components/sections/Contact'
import Footer from './components/Footer'

// Heavy WebGL layers load lazily so they never block the initial paint /
// the cinematic intro from starting immediately.
const Scene3D = lazy(() => import('./three/Scene3D'))
const SmokeCursor = lazy(() => import('./effects/SmokeCursor'))

export default function App() {
  const [introDone, setIntroDone] = useState(false)

  return (
    <SmoothScroll>
      <div className="relative min-h-screen">
        <Background />
        <Suspense fallback={null}>
          <Scene3D />
        </Suspense>
        <Suspense fallback={null}>
          <SmokeCursor />
        </Suspense>
        <Cursor />
        {!introDone && <Intro onComplete={() => setIntroDone(true)} />}
        <Navbar />
        <main>
          <Hero />
          <About />
          <Skills />
          <Experience />
          <Services />
          <PaymentProofs />
          <Stats />
          <Contact />
        </main>
        <Footer />
      </div>
    </SmoothScroll>
  )
}
