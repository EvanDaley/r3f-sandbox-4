import React from "react"
import { Html } from "@react-three/drei"

export default function PaletteInfoOverlay({ mode, label, onSwitch }) {
    return (
        <Html position={[10,1,1]}>
            <div
                style={{
                    position: "absolute",
                    bottom: "20px",
                    right: "20px",
                    background: "rgba(0,0,0,0.6)",
                    color: "#fff",
                    padding: "10px 15px",
                    borderRadius: "8px",
                    fontFamily: "sans-serif",
                    minWidth: "200px",
                    textAlign: "center",
                }}
            >
                <div style={{ fontSize: "14px", marginBottom: "6px" }}>
                    <strong>Mode:</strong>{" "}
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </div>
                <div style={{ fontSize: "12px", opacity: 0.8 }}>{label}</div>
                <button
                    onClick={onSwitch}
                    style={{
                        marginTop: "8px",
                        padding: "6px 10px",
                        fontSize: "12px",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        background: "#ffd166",
                        color: "#333",
                        fontWeight: 600,
                    }}
                >
                    Switch Palette
                </button>
            </div>
        </Html>
    )
}
