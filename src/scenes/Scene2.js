import * as THREE from 'three'
import React, { useState, useEffect, useRef, Suspense } from 'react'
import { OrbitControls, OrthographicCamera, Stage } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useSpring, animated } from '@react-spring/three'
import Pylon from "../components/props/sprites/Pylon";
import LinesRobot from "../components/characters/LinesRobot";
import Tree from "../components/props/sprites/Tree";

const Cell = React.forwardRef(function Cell({ position, onClick }, ref) {
    const [hovered, setHovered] = useState(false)
    const [randomNumber, setRandomNumber] = useState(0)

    useEffect(() => {
        setRandomNumber(Math.floor(Math.random() * 3) + 5)
    }, [])

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
                    key={hovered ? 'hover' : `base-${randomNumber}`}
                    color={
                        hovered
                            ? '#558855'
                            : `#${randomNumber}8${randomNumber}8${randomNumber}8`
                    }
                />
            </mesh>
        </group>
    )
})

function grid(w, h) {
    const res = []
    for (let x = 0; x < w; x++) {
        for (let y = 0; y < h; y++) res.push([x, 0, y])
    }
    return res
}

function SmoothMove({ children, position }) {
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
        // const duration = Math.min(Math.max(distance * 100, 200), 1000)
        const duration = 50

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

function Room() {
    const spacing = 1.05
    const cellCount = 15
    const cells = grid(cellCount, cellCount).map(([x, y, z]) => [
        x * spacing,
        -0.5,
        z * spacing,
    ])

    const [position, setPosition] = useState([0, 0, 0])
    const onTargetClicked = (p) => setPosition([p[0], 0, p[2]])

    return (
        <group position={[-((cellCount / 2) * spacing), 0, -((cellCount / 2) * spacing)]}>
            {cells.map((pos) => (
                <Cell onClick={onTargetClicked} key={`cell-${pos[0]}-${pos[2]}`} position={pos} />
            ))}
            <SmoothMove position={[position[0], position[1], position[2]]}>
                 <LinesRobot scale={[1, 1, 1]} />
            </SmoothMove>
        </group>
    )
}

export default function Scene() {
    return (
        <>
            <color attach="background" args={['#111111']} />

            <Suspense fallback={null}>
                <LinesRobot position={[-4,0,0]}/>
                {/*<LinesRobot position={[4,0,0]}/>*/}
                {/*<ExampleSprite position={[0,1,5]}/>*/}
                {/*<ExampleSprite position={[0,1,-5]}/>*/}

                <Pylon position={[0,1,0]}/>

                {/*{[...Array(3)].map((_, x) =>*/}
                {/*    [...Array(3)].map((_, z) => (*/}
                {/*        <Pylon key={`${x}-${z}`} position={[x * 5 - 5, 1, z * 5 - 5]} />*/}
                {/*    ))*/}
                {/*)}*/}

                <Tree position={[-2 + -4,1,-6]}/>
                {/*<Tree position={[-2 + -3,1,-6]}/>*/}
                <Tree position={[-2 + -2,1,-6]}/>
                {/*<Tree position={[-2 + -1,1,-6]}/>*/}
                <Tree position={[-2 + 0,1,-6]}/>
                {/*<Tree position={[-2 + 1,1,-6]}/>*/}
                <Tree position={[-2 + 2,1,-6]}/>
                {/*<Tree position={[-2 + 2,1,-6]}/>*/}
                <Tree position={[-2 + 4,1,-6]}/>
                {/*<Tree position={[-2 + 4,1,-6]}/>*/}
                <Tree position={[-2 + 6,1,-6]}/>
                {/*<Tree position={[-2 + 6,1,-6]}/>*/}
                <Tree position={[-2 + 8,1,-6]}/>
                {/*<Tree position={[-2 + 8,1,-6]}/>*/}
                {/*<Tree position={[-2 + 8,1,-6]}/>*/}


                <group position={[2, 3, 0]}>
                    <pointLight color="#66ffff" intensity={25} decay={1} distance={250} />
                </group>
                <ambientLight intensity={1} color="#aaffaa" />
                <OrthographicCamera makeDefault position={[15, 15, 15]} zoom={60} />
                <Room />
            </Suspense>
            <OrbitControls
                minPolarAngle={Math.PI / 10}
                maxPolarAngle={Math.PI / 1.5}
                enableZoom={true}
                rotateSpeed={0.12}
                enablePan={true}
                enableRotate={true}
                mouseButtons={{
                    LEFT: null,
                    // MIDDLE: THREE.MOUSE.ROTATE,
                    MIDDLE: null,
                    RIGHT: THREE.MOUSE.PAN
                }}
                onChange={(e) => {
                    const cam = e.target.object;
                    if (cam.position.y < 2) {
                        cam.position.y = 2; // clamp to ground
                    }
                }}
            />
            {/*</Stage>*/}
        </>
    )
}
