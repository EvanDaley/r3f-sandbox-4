// grid_generator/Cell.js
import React, { useState, useEffect } from "react"

const Cell = React.forwardRef(function Cell({ position, onClick }, ref) {
    const [hovered, setHovered] = useState(false)
    const [randomNumber, setRandomNumber] = useState(0)

    useEffect(() => {
        setRandomNumber(Math.floor(Math.random() * 10) + 5) // 5–14 for some variety
    }, [])

    // Make red dominant: high R, lower G/B
    const red = Math.min(15, randomNumber + 8).toString(16)  // boosted red
    const green = Math.floor(randomNumber / 2).toString(16)  // small green
    const blue = Math.floor(randomNumber / 3).toString(16)   // small blue
    const baseColor = `#${red}${green}${blue}`

    return (
        <group ref={ref}>
            <mesh
                onClick={() => onClick(position)}
                rotation={[-Math.PI / 2, 0, 0]}
                onPointerEnter={() => setHovered(true)}
                onPointerLeave={() => setHovered(false)}
                position={position}
            >
                <planeGeometry args={[1, 1]} />
                <meshStandardMaterial
                    dispose={null}
                    key={hovered ? "hover" : `base-${randomNumber}`}
                    color={hovered ? "#cc4444" : baseColor}
                />
            </mesh>
        </group>
    )
})

export default Cell
