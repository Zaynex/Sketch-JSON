const filterFrame = (frame, multiX, multiY) => {
    const { width, height, x, y} = frame
    return {
        width,
        height,
        left: (multiX ? (x + multiX) : x),
        top: (multiY? (y + multiY) : y)
    }
}

module.exports = filterFrame