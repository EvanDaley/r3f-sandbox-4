import React, {useRef} from "react";
import {useFrame} from "@react-three/fiber";

export default function FloatingEffect({ children, speed = .1, height = 0.25 }) {
    const ref = useRef()
    speed = .1
    useFrame(({ clock }) => {
        const t = clock.getElapsedTime() * speed
        ref.current.position.y = Math.sin(t) * height + (ref.current.userData.baseY || 0)
        ref.current.rotation.y += 0.01 * speed
    })
    return <group ref={ref}>{children}</group>
}