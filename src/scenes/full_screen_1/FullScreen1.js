import React, { useRef, useEffect, useLayoutEffect  } from "react"
import { useFrame } from "@react-three/fiber"
import { SpotLight, OrbitControls, useTexture, useHelper, CameraShake } from "@react-three/drei"
import * as THREE from "three"
import { useControls } from "leva"

import { Center, AccumulativeShadows, RandomizedLight, Environment, useGLTF } from '@react-three/drei'
import { FlakesTexture } from 'three-stdlib'

export default function Scene() {
    const light = useRef()

    // ✅ safer href-based path (handles trailing slashes / filenames)
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

    const { intensity, distance, angle, penumbra, decay, color, focus } = useControls("Spotlight", {
        intensity: { value: 100, min: 0, max: 500 },
        distance: { value: 0, min: 0, max: 20 },
        angle: { value: Math.PI / 6, min: 0, max: Math.PI / 3 },
        penumbra: { value: 1, min: 0, max: 1 },
        decay: { value: 2, min: 1, max: 2 },
        focus: { value: 1, min: 0, max: 1 },
        color: "#ffffff",
    })

    useEffect(() => {
        if (light.current && texture) {
            light.current.map = texture
            light.current.shadow.focus = focus
            light.current.needsUpdate = true
        }
    }, [texture, focus])

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime() / 3
        if (light.current) {
            light.current.position.x = Math.cos(t) * 2.5
            light.current.position.z = Math.sin(t) * 2.5
        }
    })

    return (
        <>
            {/*<OrbitControls target={[0, 1, 0]} maxPolarAngle={Math.PI / 2} minDistance={2} maxDistance={10} />*/}
            <hemisphereLight args={["#ffffff", "#8d8d8d", 0.15]} />

            <mesh rotation-x={-Math.PI / 2} position-y={-1} receiveShadow>
                <planeGeometry args={[20, 20]} />
                <meshStandardMaterial color="#bcbcbc" />
            </mesh>

            <mesh castShadow position={[0, 0.8, 0]}>
                <sphereGeometry args={[0.5, 64, 64]} />
                <meshLambertMaterial color="white" />
            </mesh>

            <SpotLight
                ref={light}
                position={[2.5, 5, 2.5]}
                color={color}
                intensity={intensity}
                distance={distance}
                angle={angle}
                penumbra={penumbra}
                decay={decay}
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
                shadow-bias={-0.003}
            />


            <group position={[0, -0.5, 0]}>
                <Center top>
                    <Suzi rotation={[-0.63, 0, 0]} scale={2} />
                </Center>
                <Center top position={[-2, 0, 1]}>
                    <mesh castShadow>
                        <sphereGeometry args={[0.25, 64, 64]} />
                        <meshStandardMaterial color="lightblue" />
                    </mesh>
                </Center>
                <Center top position={[2.5, 0, 1]}>
                    <mesh castShadow rotation={[0, Math.PI / 4, 0]}>
                        <boxGeometry args={[0.5, 0.5, 0.5]} />
                        <meshStandardMaterial color="indianred" />
                    </mesh>
                </Center>
                {/*<AccumulativeShadows temporal frames={100} color="orange" colorBlend={2} toneMapped={true} alphaTest={0.75} opacity={2} scale={12}>*/}
                {/*    <RandomizedLight intensity={Math.PI} amount={8} radius={4} ambient={0.5} position={[5, 5, -10]} bias={0.001} />*/}
                {/*</AccumulativeShadows>*/}
            </group>
            {/*<OrbitControls minPolarAngle={0} maxPolarAngle={Math.PI / 2} />*/}

            <CameraShake
                maxYaw={0.1} // Max amount camera can yaw in either direction
                maxPitch={0.05} // Max amount camera can pitch in either direction
                maxRoll={0.05} // Max amount camera can roll in either direction
                yawFrequency={0.05} // Frequency of the the yaw rotation
                pitchFrequency={0.2} // Frequency of the pitch rotation
                rollFrequency={0.2} // Frequency of the roll rotation
                intensity={1} // initial intensity of the shake
                decayRate={0.65} // if decay = true this is the rate at which intensity will reduce at />
            />
        </>
    )

    function Suzi(props) {
        const { scene, materials } = useGLTF('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/suzanne-high-poly/model.gltf')
        useLayoutEffect(() => {
            scene.traverse((obj) => obj.isMesh && (obj.receiveShadow = obj.castShadow = true))
            materials.default.color.set('orange')
            // materials.default.roughness = 0
            materials.default.normalMap = new THREE.CanvasTexture(new FlakesTexture(), THREE.UVMapping, THREE.RepeatWrapping, THREE.RepeatWrapping)
            materials.default.normalMap.repeat.set(40, 40)
            // materials.default.normalScale.set(0.1, 0.1)
        })
        return <primitive object={scene} {...props} />
    }

}
