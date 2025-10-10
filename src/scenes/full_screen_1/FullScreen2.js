import React, { useRef, useEffect, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { SpotLight, CameraShake, Stars, useTexture, useGLTF } from "@react-three/drei"
import * as THREE from "three"
import { FlakesTexture } from "three-stdlib"
import { Leva, useControls } from "leva"

export default function Scene() {
    const light = useRef()
    const group = useRef()
    const pulseLight = useRef()
    const flickerLight = useRef()

    const baseHref = window.location.href.endsWith("/")
        ? window.location.href.slice(0, -1)
        : window.location.href
    const texture = useTexture(baseHref + "/images/textures/disturb.jpg")

    useEffect(() => {
        if (texture) {
            texture.minFilter = THREE.LinearFilter
            texture.magFilter = THREE.LinearFilter
            texture.generateMipmaps = false
            texture.colorSpace = THREE.SRGBColorSpace
        }
    }, [texture])

    const { intensity, distance, angle, penumbra, decay } = useControls("Spotlight", {
        intensity: { value: 200, min: 0, max: 500 },
        distance: { value: 5, min: 0, max: 20 },
        angle: { value: Math.PI / 3, min: 0, max: Math.PI / 2 },
        penumbra: { value: 0.8, min: 0, max: 1 },
        decay: { value: 2, min: 1, max: 2 },
    })

    useFrame(({ clock }) => {
        const t = clock.elapsedTime

        // Spotlight wild motion + color shift
        if (light.current) {
            light.current.position.x = Math.sin(t * 1.2) * 4
            light.current.position.z = Math.cos(t * 1.5) * 4
            light.current.intensity = 200 + Math.sin(t * 8) * 150
            light.current.color.setHSL((t * 0.3) % 1, 1, 0.5)
        }

        // Pulse light flashes
        if (pulseLight.current) {
            pulseLight.current.intensity = Math.abs(Math.sin(t * 15)) * 10
            pulseLight.current.color.setHSL((t * 0.8) % 1, 1, 0.6)
        }

        // Flicker ambient light chaos
        if (flickerLight.current) {
            flickerLight.current.intensity = 0.5 + Math.random() * 0.4
        }

        // Group spins erratically
        if (group.current) {
            group.current.rotation.y += 0.02 + Math.sin(t * 2) * 0.01
            group.current.rotation.x += Math.cos(t * 1.5) * 0.005
        }
    })

    return (
        <>
            <Leva hidden />
            <color attach="background" args={["#000000"]} />
            <Stars radius={100} depth={50} count={10000} factor={4} saturation={0} fade speed={4} />

            <ambientLight ref={flickerLight} intensity={0.4} />

            <SpotLight
                ref={light}
                position={[0, 6, 0]}
                angle={angle}
                penumbra={penumbra}
                decay={decay}
                distance={distance}
                intensity={intensity}
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
                shadow-bias={-0.003}
            />

            <pointLight ref={pulseLight} position={[0, 2, 0]} intensity={3} />

            <group ref={group}>
                <mesh castShadow position={[0, 0.8, 0]}>
                    <sphereGeometry args={[0.5, 64, 64]} />
                    <meshStandardMaterial color="white" roughness={0.2} metalness={0.9} />
                </mesh>
                <FloatingBox position={[1, 0.3, -1]} color="#ff0055" />
                <FloatingBox position={[-1.2, 1, 0.5]} color="#00ffff" />
                <FloatingBox position={[2, -0.2, 1]} color="#ffff00" />
                <Suzi position={[0, 0.5, 0]} />
            </group>

            <mesh rotation-x={-Math.PI / 2} position-y={-1} receiveShadow>
                <planeGeometry args={[30, 30]} />
                <meshStandardMaterial color="#111" metalness={0.4} roughness={0.7} />
            </mesh>

            <CameraShake
                maxYaw={0.15}
                maxPitch={0.1}
                maxRoll={0.1}
                yawFrequency={1.5}
                pitchFrequency={2}
                rollFrequency={2.5}
                intensity={0.6}
                decayRate={0.4}
            />
        </>
    )

    function FloatingBox({ color, position }) {
        const ref = useRef()
        useFrame(({ clock }) => {
            const t = clock.elapsedTime
            if (ref.current) {
                ref.current.position.y = position[1] + Math.sin(t * 3 + position[0]) * 0.3
                ref.current.rotation.x += 0.05
                ref.current.rotation.y += 0.07
            }
        })
        return (
            <mesh ref={ref} position={position}>
                <boxGeometry args={[0.5, 0.5, 0.5]} />
                <meshStandardMaterial color={color} metalness={0.8} roughness={0.3} />
            </mesh>
        )
    }

    function Suzi(props) {
        const { scene, materials } = useGLTF(
            "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/suzanne-high-poly/model.gltf"
        )
        useEffect(() => {
            scene.traverse((obj) => (obj.isMesh ? (obj.castShadow = obj.receiveShadow = true) : null))
            materials.default.color.set("orange")
            materials.default.roughness = 0.6
            materials.default.metalness = 0.9
            materials.default.emissive = new THREE.Color(0xff6600)
            materials.default.normalMap = new THREE.CanvasTexture(new FlakesTexture())
            materials.default.normalMap.repeat.set(40, 40)
            materials.default.normalScale.set(0.5, 0.5)
        }, [scene, materials])
        return <primitive object={scene} {...props} />
    }
}
