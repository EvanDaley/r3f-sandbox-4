import React, { useEffect, useMemo } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'

const MODEL_PATH = window.location.href + '/models/color_palette/Ship.glb'

export default function ExampleShip(props) {
    const { scene } = useGLTF(MODEL_PATH)
    return <primitive object={scene} {...props} />
}

useGLTF.preload(MODEL_PATH)