import React from 'react'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

export default function Tree(props) {
    const texture = useTexture(window.location.href + '/images/sprites/tree.png')

    return (
        <sprite {...props} scale={[3, 3, 3]}>
            <spriteMaterial map={texture} transparent />
        </sprite>
    )
}
