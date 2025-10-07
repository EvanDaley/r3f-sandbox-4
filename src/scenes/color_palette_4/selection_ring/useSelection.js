// hooks/useSelection.js
import { useState, useCallback } from "react"

export default function useSelection() {
    const [selected, setSelected] = useState(null)

    const select = useCallback((id, position) => {
        setSelected({ id, position })
    }, [])

    const clear = useCallback(() => setSelected(null), [])

    return { selected, select, clear }
}
