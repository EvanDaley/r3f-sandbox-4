import { useCallback } from "react"
import * as THREE from "three"

export default function useSelectable(select) {
    const handleSelect = useCallback((id) => {
        return (e) => {
            e.stopPropagation()
            const worldPos = new THREE.Vector3()
            e.object.getWorldPosition(worldPos)
            select(id, worldPos.toArray())
        }
    }, [select])

    return { handleSelect }
}