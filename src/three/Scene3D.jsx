import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import ParticleField from './ParticleField'
import DistortedForm from './DistortedForm'
import { viewState } from '../lib/viewState'

function Rig({ isTouch }) {
  const { camera } = useThree()
  const target = useRef(new THREE.Vector3(0, 0, 0))

  useFrame(() => {
    const s = viewState.scrollProgress
    // camera "moves through" the environment as the page scrolls
    camera.position.z = 9 - s * 3
    camera.position.y = -s * 3.5
    camera.fov = 50 + s * 4
    camera.updateProjectionMatrix()

    if (!isTouch) {
      target.current.x += (viewState.pointer.x * 1.1 - target.current.x) * 0.03
      target.current.y += (viewState.pointer.y * 0.6 - target.current.y) * 0.03
      camera.position.x += (target.current.x - camera.position.x) * 0.04
    }
    camera.lookAt(0, camera.position.y * 0.3, -4)
    if (!isTouch) {
      // applied after lookAt so it isn't overwritten by the quaternion it sets
      camera.rotation.z = target.current.x * 0.01
    }
  })

  return null
}

export default function Scene3D() {
  const isTouch = useMemo(() => viewState.isTouch, [])
  const particleCount = isTouch ? 320 : 900

  // Respect reduced-motion the same way the rest of the site does: the
  // gradient Background layer already carries the black/red identity
  // without a moving 3D scene on top of it.
  if (viewState.reducedMotion) return null

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none" aria-hidden="true">
      <Canvas
        dpr={isTouch ? [1, 1.3] : [1, 1.8]}
        camera={{ position: [0, 0, 9], fov: 50, near: 0.1, far: 60 }}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(0x000000, 0)
          scene.fog = new THREE.FogExp2(0x08090a, isTouch ? 0.05 : 0.045)
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <pointLight position={[5, 5, 5]} intensity={0.6} color={0xe4322c} />
          <ParticleField count={particleCount} />
          {!isTouch && <DistortedForm />}
          <Rig isTouch={isTouch} />
        </Suspense>
      </Canvas>
    </div>
  )
}
