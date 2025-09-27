import * as THREE from 'three'
import { useRef, useEffect, useMemo } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'

const normalMaterial = new THREE.MeshNormalMaterial({
    flatShading: false,    // optional, depends on look
})
normalMaterial.color = new THREE.Color(0, 0, 1)

const innerMaterial = new THREE.MeshDepthMaterial()
const redPhong = new THREE.MeshPhongMaterial({ color: 0xff4444, shininess: 30 })

const redNormalMaterial = new THREE.MeshNormalMaterial()

redNormalMaterial.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
        'gl_FragColor = vec4( packNormalToRGB( normal ), opacity );',
        `
      vec3 baseColor = packNormalToRGB(normal);
      // bias toward red (scale R up, G/B down)
      baseColor = normalize(baseColor * vec3(2.0, 0.5, 0.5));
      gl_FragColor = vec4(baseColor, opacity);
    `
    )
}

const MODEL_PATHS = {
    fragments: window.location.href + '/models/hello_example/hello-fragments.glb',
    text: window.location.href + '/models/hello_example/hello-text.glb',
}



// useGLTF.preload(MODEL_PATHS.fragments)
// useGLTF.preload(MODEL_PATHS.text)

export function HelloFragments({ visible, ...props }) {
    const group = useRef()
    const { scene, animations, materials } = useGLTF(MODEL_PATHS.fragments)
    const { actions } = useAnimations(animations, group)

    useMemo(() => {
        scene.traverse((o) => {
            if (o.type === 'Mesh' && o.material === materials.inner) {
                o.material = redNormalMaterial
            }
        })
    }, [scene, materials])  // include dependencies

    useEffect(() => {
        console.log(visible)
        if (visible) {
            Object.values(actions).forEach((action) => {
                action.reset().play()
                action.repetitions = 0
                action.clampWhenFinished = true
            })
        } else {
            // Object.values(actions).forEach((action) => {
            //     action.stop()
            //     action.reset()   // rewinds to frame 0
            // })
            // // Reset transforms on the scene if needed
            // scene.traverse((o) => {
            //     if (o.isMesh || o.isGroup) {
            //         o.position.set(0, 0, 0)
            //         o.rotation.set(0, 0, 0)
            //         o.scale.set(1, 1, 1)
            //     }
            // })
        }
    }, [visible, actions, scene])

    return <primitive ref={group} object={scene} {...props} />
}

export function HelloModel(props) {
    const { scene } = useGLTF(MODEL_PATHS.text)
    return <primitive object={scene} {...props} />
}
