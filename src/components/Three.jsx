import * as THREE from 'three'
import { Suspense, useState, useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stats, OrbitControls, Environment, useGLTF, Clone, Html, ContactShadows } from '@react-three/drei'
import { useControls } from 'leva'

const Models = [
  { title: 'DADAIMA', url: './DADAIMA3.glb', miEscala: .4, miPosicion: -0.2 },
  // { title: 'DADAIMA1', url: './DADAIMA1.glb', miEscala: .5, miPosicion: 0.0 },
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