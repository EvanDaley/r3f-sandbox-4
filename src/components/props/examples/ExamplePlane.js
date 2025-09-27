import React from 'react'
import { useTexture } from '@react-three/drei'

export default function ExamplePlane(props) {
    const texture = useTexture(window.location.href + '/images/textures/flakes.png')

    return (
        <mesh {...props}>
            <planeGeometry args={[2, 2]} />
            <meshBasicMaterial map={texture} />
        </mesh>
    )
}