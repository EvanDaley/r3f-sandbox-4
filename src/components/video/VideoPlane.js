import * as THREE from "three"
import React, { useRef, useEffect } from "react"
import { useVideoTexture } from "@react-three/drei"

export default function VideoPlane({ src, position = [0, 0, 0], height = 4 }) {
    const texture = useVideoTexture(src, { muted: true, loop: true, autoplay: true })
    const mesh = useRef()

    useEffect(() => {
        if (texture) {
            texture.wrapS = THREE.ClampToEdgeWrapping
            texture.wrapT = THREE.ClampToEdgeWrapping
            texture.encoding = THREE.sRGBEncoding
        }
    }, [texture])

    const aspectRatio = texture?.image?.videoWidth
        ? texture.image.videoWidth / texture.image.videoHeight
        : 9 / 16

    const width = height * aspectRatio

    return (
        <mesh ref={mesh} position={position}>
            <planeGeometry args={[width, height]} />
            <meshBasicMaterial
                map={texture}
                toneMapped={false}
                side={THREE.DoubleSide}
            />
        </mesh>
    )
}
