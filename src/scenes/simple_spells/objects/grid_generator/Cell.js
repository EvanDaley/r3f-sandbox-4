import React, { useRef, useState, useEffect } from "react"
import * as THREE from "three"

const Cell = React.forwardRef(function Cell({ position, onClick }, ref) {
    const meshRef = useRef()
    const [hovered, setHovered] = useState(false)
    const [randomNumber, setRandomNumber] = useState(0)

    useEffect(() => {
        setRandomNumber(Math.floor(Math.random() * 3) + 5)
    }, [])

    const red = randomNumber.toString(16)
    const green = "8"
    const blue = randomNumber.toString(16)
    const baseColor = `#${red}${green}${blue}${green}${blue}${green}`
    const cellSize = 0.97

    return (
        <group ref={ref}>
            <mesh
                ref={meshRef}
                rotation={[-Math.PI / 2, 0, 0]}
                position={position}
                onPointerEnter={() => setHovered(true)}
                onPointerLeave={() => setHovered(false)}
                onClick={() => {
                    console.log("Click position:", position)
                    onClick(position)
                }}
            >
                <planeGeometry args={[cellSize, cellSize]} />
                <meshStandardMaterial
                    dispose={null}
                    key={hovered ? "hover" : `base-${randomNumber}`}
                    color={hovered ? "#558855" : baseColor}
                />
            </mesh>
        </group>
    )
})

export default Cell
