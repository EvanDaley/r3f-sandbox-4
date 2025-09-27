// grid_generator/GridMove.js
import * as THREE from "three"
import React, { useRef, useEffect } from "react"
import { useSpring, animated } from "@react-spring/three"

export default function GridMove({ children, position }) {
    const groupRef = useRef()
    const prevPos = useRef(new THREE.Vector3(...position))
    const [springProps, api] = useSpring(() => ({
        pos: position,
        config: { duration: 500 },
    }))

    useEffect(() => {
        const from = prevPos.current
        const to = new THREE.Vector3(...position)
        const distance = from.distanceTo(to)
        const duration = 50 // tweakable

        api.start({
            pos: position,
            config: { duration },
            onChange: (anim) => {
                const newPos = new THREE.Vector3(...anim.value.pos)
                const delta = newPos.clone().sub(prevPos.current)
                if (groupRef.current && (delta.x !== 0 || delta.z !== 0)) {
                    let angle = Math.atan2(delta.x, delta.z)
                    const snap45 = Math.PI / 4
                    angle = Math.round(angle / snap45) * snap45
                    groupRef.current.rotation.y = angle
                    prevPos.current.copy(newPos)
                }
            },
        })
    }, [position])

    return (
        <animated.group ref={groupRef} position={springProps.pos}>
            {children}
        </animated.group>
    )
}
