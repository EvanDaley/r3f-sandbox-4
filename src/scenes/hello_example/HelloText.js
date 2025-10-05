import * as THREE from 'three'
import { useRef, useEffect, useMemo } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { useFrame } from '@react-three/fiber' // ✅ FIXED IMPORT

// Create a custom normal material with emissive glow
const glowingNormalMaterial = new THREE.MeshNormalMaterial()

glowingNormalMaterial.onBeforeCompile = (shader) => {
    shader.uniforms.emissiveStrength = { value: 2.5 }

    // prepend uniform to shader
    shader.fragmentShader = `
    uniform float emissiveStrength;
  ` + shader.fragmentShader

    shader.fragmentShader = shader.fragmentShader.replace(
        'gl_FragColor = vec4( packNormalToRGB( normal ), opacity );',
        `
      vec3 baseColor = packNormalToRGB(normal);
      // bias toward red, lower G/B
      baseColor = normalize(baseColor * vec3(1.8, 0.5, 0.5));

      // emissive term (bright enough for bloom to pick up)
      vec3 emissive = vec3(2.5, 0.6, 0.6) * emissiveStrength;
      baseColor += emissive;

      gl_FragColor = vec4(baseColor, opacity);
    `
    )

    glowingNormalMaterial.userData.shader = shader
}

const MODEL_PATHS = {
    fragments: window.location.href + '/models/hello_example/hello-fragments.glb',
    text: window.location.href + '/models/hello_example/hello-text.glb',
}

export function HelloFragments({ visible, ...props }) {
    const group = useRef()
    const { scene, animations, materials } = useGLTF(MODEL_PATHS.fragments)
    const { actions } = useAnimations(animations, group)

    // Swap inner material for glowing shader
    useMemo(() => {
        scene.traverse((o) => {
            if (o.type === 'Mesh' && o.material === materials.inner) {
                o.material = glowingNormalMaterial
            }
        })
    }, [scene, materials])

    // Animate glow pulse
    const hasFadedRef = useRef(false)

    useFrame(({ clock }) => {
        const shader = glowingNormalMaterial.userData.shader
        if (!shader) return

        if (hasFadedRef.current) return // stop updating once it’s done fading

        const t = clock.getElapsedTime() * 1
        const val = 1 + Math.sin(t) * 1.5

        shader.uniforms.emissiveStrength.value = val

        // Once it hits -0.5 or lower, freeze it there
        if (val <= -0.45) {
            shader.uniforms.emissiveStrength.value = -0.5
            hasFadedRef.current = true
        }
    })

    useEffect(() => {
        if (visible) {
            Object.values(actions).forEach((action) => {
                action.reset().play()
                action.repetitions = 0
                action.clampWhenFinished = true
            })
        }
    }, [visible, actions, scene])

    return <primitive ref={group} object={scene} {...props} />
}

export function HelloModel(props) {
    const { scene } = useGLTF(MODEL_PATHS.text)
    return <primitive object={scene} {...props} />
}
