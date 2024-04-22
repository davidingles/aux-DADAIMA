import * as THREE from 'three'
import { Suspense, useState, useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stats, OrbitControls, Environment, useGLTF, Clone, Html, ContactShadows } from '@react-three/drei'
import { useControls } from 'leva'

const Models = [
  // { title: 'Hammer', url: './models/hammer.glb' },
  // { title: 'cajaSeparadorRemesh', url: './gltf/cajaSeparadorRemesh.glb' },
  // { title: 'cajaSeparadorRemesh2', url: './gltf/cajaSeparadorRemesh2.glb' },
  // { title: 'troquel4e0067_glb', url: './gltf/troquel4e0067_glb.glb' },
  // { title: 'CajaSeparador', url: './gltf/CajaSeparador.glb' },
  // { title: 'jamoneroMacondo2', url: './gltf/jamoneroMacondo2.glb' },
  // { title: 'jamoneroMacondo2', url: './gltf/jamoneroMacondo2.glb' },
  // { title: 'antorcha2', url: './antorcha2.glb', miEscala: .5, miPosicion: -0.3 },
  // { title: 'antorcha1', url: './antorcha1.glb', miEscala: .5, miPosicion: -0.3 },
  // { title: 'donaciones', url: './donaciones.glb', miEscala: .2, miPosicion: -0.3 },
  { title: 'conesa', url: './CONESA.glb', miEscala: 1.6, miPosicion: 0.2 },
]

function Model({ url, miEscala, miPosicion }) {
  const { scene } = useGLTF(url)
  scene.traverse((node) => {
    if (node.isMesh) {
      node.material.transparent = true
      node.material.roughness = 1
    }
  })
  const group = useRef()
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    // group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, Math.cos(t / 4) / 20 + 0.25, 0.1)
    // group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, Math.sin(t / 8) / 10, 0.1)
    // group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, Math.sin(t / 8) / 20, 0.1)
    group.current.position.y = miPosicion
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, (-2 + Math.sin(t)) / 90, 0.6)
  })
  return (
    <group ref={group} dispose={null} position={[0, 2, 0]} scale={miEscala}>
      <Clone object={scene} castShadow receiveShadow />
    </group>
  )
}

function Fallback() {
  return <Html><div>Loading...</div></Html>
}

export default function EstucheConAsas({ title, escala, posicion }) {
  const [currentTitle, setCurrentTitle] = useState(title)

  const { modelo } = useControls('Model', {
    modelo: {
      value: title, // valor inicial
      options: Models.map(({ title }) => title), // opciones para seleccionar
    },
  })

  useEffect(() => {
    setCurrentTitle(modelo) // Usa el valor de modelo devuelto por useControls
  }, [modelo])

  const modelIndex = Models.findIndex((m) => m.title === currentTitle)
  const modelUrl = modelIndex !== -1 ? Models[modelIndex].url : null
  const modelEscala = modelIndex !== -1 ? Models[modelIndex].miEscala : escala
  const modelPosicion = modelIndex !== -1 ? Models[modelIndex].miPosicion : posicion

  return (
    <>
      <Canvas camera={{ position: [0, .4, -0.6], near: .01, fov: 50 }}>
        <pointLight position={[100, 100, 0]} intensity={55555} decay={2} />
        <pointLight position={[-100, 100, 0]} intensity={55555} decay={2} />
        <pointLight position={[-100, 100, 100]} intensity={11111} decay={2} />
        <pointLight position={[100, -100, -100]} intensity={11111} decay={2} />
        <pointLight position={[100, -100, 100]} intensity={11111} decay={2} />
        <ambientLight intensity={4} />
        <Suspense fallback={<Fallback />}>
          {modelUrl && <Model url={modelUrl} miEscala={modelEscala} miPosicion={modelPosicion} />}
        </Suspense>
        <OrbitControls autoRotate autoRotateSpeed={.6} />
        <ContactShadows resolution={512} scale={30} position={[0, -0.2, 0.0]} blur={.1} opacity={.5} far={10} color='#8a6246' />
      </Canvas>
    </>
  )
}