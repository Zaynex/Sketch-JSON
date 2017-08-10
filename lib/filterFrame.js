const filterFrame = (frame) => {
    const { width, height, x, y} = frame
    return {
        width,
        height,
        left: x,
        top: y
    }
}

module.exports = filterFrame