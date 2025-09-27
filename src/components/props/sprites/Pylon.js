import React, { useEffect, useRef, useState } from 'react'
import { Html, Billboard, useTexture } from '@react-three/drei'

export default function Pylon({
                                  position = [0, 0, 0],
                                  level = 2,
                                  energy = 7,
                                  cost = 100,
                                  onUpgrade = () => {},
                                  ...props
                              }) {
    const texture = useTexture(window.location.href + '/images/sprites/EnergyGenerator.png')
    const buttonRef = useRef(null)
    const [pressed, setPressed] = useState(false)

    // Keyboard shortcut: U => trigger click + visual press
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key.toLowerCase() === 'u') {
                if (buttonRef.current) {
                    // Visually press
                    setPressed(true)
                    // Trigger the real click
                    buttonRef.current.click()
                    // Release after a short flash
                    setTimeout(() => setPressed(false), 150)
                }
            }
        }
        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [])

    return (
        <group position={position} {...props}>
            {/* The pylon sprite */}
            <sprite scale={[3, 3, 3]}>
                <spriteMaterial map={texture} transparent />
            </sprite>

            {/* Floating UI above it (crisp DOM via Html sprite) */}
            <Billboard position={[0, 3.2, 0]} follow>
                <Html
                    sprite
                    occlude
                    pointerEvents="auto"
                    center
                >
                    <div
                        style={{
                            minWidth: 140,
                            padding: '8px 10px',
                            borderRadius: 12,
                            background: 'rgba(20,20,28,0.9)',
                            color: 'white',
                            boxShadow: '0 6px 18px rgba(0,0,0,0.35)',
                            fontFamily: 'system-ui, sans-serif',
                            fontSize: 14,
                            lineHeight: 1.2,
                            userSelect: 'none',
                            border: '1px solid rgba(255,255,255,0.08)',
                            WebkitFontSmoothing: 'antialiased',
                            textRendering: 'optimizeLegibility',
                        }}
                    >
                        <div style={{ fontWeight: 700, marginBottom: 2 }}>Pylon {level}</div>
                        <div style={{ opacity: 0.8, marginBottom: 8 }}>Energy {energy}</div>
                        <button
                            ref={buttonRef}
                            onClick={onUpgrade}
                            style={{
                                width: '100%',
                                padding: '6px 8px',
                                borderRadius: 10,
                                border: 'none',
                                cursor: 'pointer',
                                background: pressed
                                    ? 'linear-gradient(0deg, #2563eb, #3b82f6)'
                                    : 'linear-gradient(0deg, #3b82f6, #60a5fa)',
                                color: 'white',
                                fontWeight: 700,
                                transform: pressed ? 'scale(0.96)' : 'scale(1)',
                                transition: 'all 0.15s ease',
                                outline: pressed ? '2px solid rgba(255,255,255,0.35)' : 'none',
                            }}
                            title="Upgrade [U]"
                        >
                            Upgrade ({cost}) <span style={{ opacity: 0.8 }}>[U]</span>
                        </button>
                    </div>
                </Html>
            </Billboard>
        </group>
    )
}
