import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function CapsuleField() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, el.clientWidth / el.clientHeight, 0.1, 100)
    camera.position.z = 14

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(el.clientWidth, el.clientHeight)
    el.appendChild(renderer.domElement)

    scene.add(new THREE.AmbientLight(0xffffff, 0.9))
    const key = new THREE.DirectionalLight(0xfff4e0, 1.1)
    key.position.set(4, 6, 8)
    scene.add(key)
    const fill = new THREE.DirectionalLight(0xdcefe4, 0.5)
    fill.position.set(-6, -2, 4)
    scene.add(fill)

    const palette = [0x1d6e4e, 0x9dc3ae, 0xe0a458, 0xcfe0d5]
    const group = new THREE.Group()
    const rng = (a, b) => a + Math.random() * (b - a)

    for (let i = 0; i < 26; i++) {
      const isCapsule = Math.random() > 0.4
      const geo = isCapsule
        ? new THREE.CapsuleGeometry(rng(0.16, 0.3), rng(0.5, 0.9), 6, 14)
        : new THREE.SphereGeometry(rng(0.14, 0.32), 20, 20)
      const mat = new THREE.MeshStandardMaterial({
        color: palette[i % palette.length],
        roughness: 0.55,
        metalness: 0.05,
        transparent: true,
        opacity: rng(0.28, 0.6),
      })
      const m = new THREE.Mesh(geo, mat)
      m.position.set(rng(-10, 10), rng(-5.5, 5.5), rng(-6, 3))
      m.rotation.set(rng(0, Math.PI), rng(0, Math.PI), rng(0, Math.PI))
      m.userData = {
        vy: rng(0.0008, 0.0026),
        rx: rng(-0.0016, 0.0016),
        rz: rng(-0.0016, 0.0016),
        phase: rng(0, Math.PI * 2),
      }
      group.add(m)
    }
    scene.add(group)

    const mouse = { x: 0, y: 0 }
    const onMouse = (e) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('pointermove', onMouse)

    const onResize = () => {
      camera.aspect = el.clientWidth / el.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(el.clientWidth, el.clientHeight)
    }
    window.addEventListener('resize', onResize)

    let raf
    let t = 0
    const tick = () => {
      t += 0.01
      group.children.forEach((m) => {
        m.position.y += Math.sin(t + m.userData.phase) * m.userData.vy
        m.rotation.x += m.userData.rx
        m.rotation.z += m.userData.rz
      })
      camera.position.x += (mouse.x * 0.7 - camera.position.x) * 0.03
      camera.position.y += (-mouse.y * 0.45 - camera.position.y) * 0.03
      camera.lookAt(0, 0, 0)
      renderer.render(scene, camera)
      if (!reduced) raf = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMouse)
      window.removeEventListener('resize', onResize)
      group.children.forEach((m) => {
        m.geometry.dispose()
        m.material.dispose()
      })
      renderer.dispose()
      el.removeChild(renderer.domElement)
    }
  }, [])

  return <div className="hero-canvas" ref={ref} aria-hidden="true" />
}

