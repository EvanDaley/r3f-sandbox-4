import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import {
    useGLTF,
    Stage,
    Grid,
    OrbitControls,
    Environment,
    Box,
    PerspectiveCamera
} from '@react-three/drei'
import { EffectComposer, Bloom, ToneMapping } from '@react-three/postprocessing'
import { easing } from 'maath'

export default function Scene() {
    const light = useRef()

    useFrame((state, delta) => {
        const t = (1 + Math.sin(state.clock.elapsedTime * 2)) / 2
        light.current.intensity = 1 + t * 4
    })

    return (
        <>
            <PerspectiveCamera
                makeDefault
                position={[-15, 0, 10]}
                fov={25}
            />

            <fogExp2 attach="fog" args={['#d0d0ff', 0.05]} />


            <Stage
                intensity={0.5}
                environment="city"
                shadows={{ type: 'accumulative', bias: -0.001, intensity: Math.PI }}
                adjustCamera={false}
            >
                {/*<Box rotation={[0, Math.PI, 0]} scale={[2, 2, 2]} position={[5,1,0]} />*/}



                <pointLight ref={light} intensity={1} color={[10, 2, 5]} distance={2.5} />
            </Stage>

            <Grid
                renderOrder={-1}
                position={[0, -1.85, 0]}
                infiniteGrid
                cellSize={0.6}
                cellThickness={0.6}
                sectionSize={3.3}
                sectionThickness={1.5}
                sectionColor={[0.5, 0.5, 10]}
                fadeDistance={30}
            />

            <OrbitControls
                autoRotate
                autoRotateSpeed={0.00}
                enableZoom={true}
                makeDefault
                // minPolarAngle={Math.PI / 2}
                maxPolarAngle={Math.PI / 2}
                onChange={(e) => {
                    const cam = e.target.object
                    if (cam.position.y < 0) {
                        cam.position.y = 0     // clamp to ground
                    }
                }}
            />

            <EffectComposer disableNormalPass>
                <Bloom luminanceThreshold={2} mipmapBlur />
                <ToneMapping />
            </EffectComposer>

            <Environment background preset="sunset" blur={0.8} />
        </>
    )
}
