import React, { useEffect, useMemo } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'

const MODEL_PATH = window.location.href + '/models/color_palette/Mineral1.glb'

export default function ExampleGeode(props) {
    const { scene } = useGLTF(MODEL_PATH)
    return <primitive object={scene} {...props} />
}

useGLTF.preload(MODEL_PATH)