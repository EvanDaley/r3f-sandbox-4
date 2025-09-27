import React from 'react'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

export default function ExampleSprite(props) {
    const texture = useTexture(window.location.href + '/images/textures/flakes.png')

    return (
        <sprite {...props}>
            <spriteMaterial map={texture} transparent />
        </sprite>
    )
}
