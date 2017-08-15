const filterFrame = (frame, multiX, multiY) => {
    const { width, height, x, y} = frame
    return {
        width,
        height,
        left: (multiX != x ? (x + multiX) : x),
        top: (multiY != y? (y + multiY) : y)
    }
}

module.exports = filterFrame