import React, { Suspense } from 'react'
import {
    OrbitControls,
    Stage,
    PerspectiveCamera,
    Environment,
    useAspect,
    useVideoTexture,
    useTexture
} from '@react-three/drei'

// Helper so all asset paths work in dev + production with subpaths
function asset(path) {
    return `${process.env.PUBLIC_URL}${path}`
}

export default function Scene() {
    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={30} />

            <Suspense fallback={null}>
                <Environment preset="studio" background blur={1.5} />
            </Suspense>

            <OrbitControls target={[1, 1, 0]} />

            <VideoPlane
                videoUrl={asset('/videos/10.mp4')}
                fallbackUrl={asset('/videos/10.jpg')}
            />
        </>
    )
}

function VideoPlane({ videoUrl, fallbackUrl }) {
    const size = useAspect(1800, 1000)
    return (
        <mesh scale={size}>
            <planeGeometry />
            <Suspense fallback={<FallbackMaterial url={fallbackUrl} />}>
                <VideoMaterial url={videoUrl} />
            </Suspense>
        </mesh>
    )
}

function VideoMaterial({ url }) {
    const texture = useVideoTexture(url)
    return <meshBasicMaterial map={texture} toneMapped={false} />
}

function FallbackMaterial({ url }) {
    const texture = useTexture(url)
    return <meshBasicMaterial map={texture} toneMapped={false} />
}
