import * as THREE from "three"

/**
 * Applies a vertical brightness gradient to a mesh geometry.
 *
 * @param {THREE.BufferGeometry} geometry - The geometry to modify.
 * @param {THREE.Color} baseColor - The base color for the gradient.
 * @param {number} minY - Minimum Y value of the object.
 * @param {number} maxY - Maximum Y value of the object.
 * @param {"low"|"high"} mode - Gradient contrast mode.
 */
export function applyVerticalGradient(geometry, baseColor, minY, maxY, mode = "low") {
    if (!geometry || !geometry.attributes?.position) return

    const pos = geometry.attributes.position
    const colors = new Float32Array(pos.count * 3)
    const height = maxY - minY || 1

    for (let i = 0; i < pos.count; i++) {
        const y = pos.getY(i)
        const t = (y - minY) / height
        const brightness =
            mode === "high" ? 0.05 + 1.45 * Math.pow(t, 1.8) : 0.2 + 1.0 * t

        const c = baseColor.clone().multiplyScalar(brightness)
        colors[i * 3 + 0] = c.r
        colors[i * 3 + 1] = c.g
        colors[i * 3 + 2] = c.b
    }

    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))
}
