import { useState, useMemo } from "react";
import ColorPalettes from "../colors/ColorPalettes";

export default function usePaletteControls(initialMode) {
    const palettes = ColorPalettes();
    const defaultMode = Object.keys(palettes)[0]; // first palette key
    const [mode, setMode] = useState(initialMode || defaultMode);

    const paletteData = useMemo(() => {
        const { colors, label } = palettes[mode];
        return { colors, label };
    }, [mode, palettes]);

    const cycleMode = () => {
        const keys = Object.keys(palettes);
        const currentIndex = keys.indexOf(mode);
        const nextMode = keys[(currentIndex + 1) % keys.length];
        setMode(nextMode);
    };

    return {
        mode,
        palette: paletteData.colors,
        label: paletteData.label,
        cycleMode,
    };
}
