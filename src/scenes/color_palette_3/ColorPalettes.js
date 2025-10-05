export default function ColorPalettes() {
    return {
        monochrome: {
            label: "Sophisticated & Subtle",
            colors: {
                primary: "#ffb703",
                secondary: "#fcbf49",
                tertiary: "#e9c46a",
            },
        },
        complementary: {
            label: "Dynamic & Energetic",
            colors: {
                primary: "#ef233c",   // red
                secondary: "#00b4d8", // cyan-blue
                tertiary: "#ffd166",  // warm accent
            },
        },
        analogous: {
            label: "Harmonious & Calm",
            colors: {
                primary: "#f4a261",
                secondary: "#e76f51",
                tertiary: "#2a9d8f",
            },
        },
        triadic: {
            label: "Balanced & Playful",
            colors: {
                primary: "#ffb703",
                secondary: "#8ecae6",
                tertiary: "#219ebc",
            },
        },

    }
}