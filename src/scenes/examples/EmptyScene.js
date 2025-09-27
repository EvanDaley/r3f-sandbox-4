import React, { Suspense } from 'react'
import {
    OrbitControls,
    Stage,
    PerspectiveCamera,
    Environment,
    useAspect,
    useVideoTexture,
    useTexture, OrthographicCamera
} from '@react-three/drei'
import ExamplePlane from "../components/props/examples/ExamplePlane";

// Helper so all asset paths work in dev + production with subpaths
function asset(path) {
    return `${process.env.PUBLIC_URL}${path}`
}

export default function Scene() {
    return (
        <>
            <OrthographicCamera makeDefault position={[15, 15, 15]} zoom={60} />

            <Suspense fallback={null}>
                <Environment preset="studio" background blur={1.5} />
                <ExamplePlane/>
            </Suspense>

            <OrbitControls target={[1, 1, 0]} />
        </>
    )
}
