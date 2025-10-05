import React, { Suspense } from 'react'
import {
    OrbitControls,
    Stage,
    PerspectiveCamera,
    Environment,
    useAspect,
    useVideoTexture,
    useTexture, OrthographicCamera, Plane
} from '@react-three/drei'
// import ExamplePlane from "../components/props/examples/ExamplePlane";


export default function Scene() {
    return (
        <>
            <OrthographicCamera makeDefault position={[5,5,5]} zoom={60} />

            {/*<Suspense fallback={null}>*/}
            {/*    <Environment preset="studio" background blur={1.5} />*/}
            {/*    /!*<ExamplePlane/>*!/*/}
            {/*</Suspense>*/}

            {/*<OrbitControls target={[1, 1, 0]} />*/}


        </>
    )
}
