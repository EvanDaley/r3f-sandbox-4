export function grid(w, h) {
    const res = []
    for (let x = 0; x < w; x++) {
        for (let y = 0; y < h; y++) {
            res.push([x, 0, y])
        }
    }
    return res
}
