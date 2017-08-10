const matchrgba = rgba => {
    let [r, g, b, a] = rgba.slice(5, -1).split(',')
    return [
        (r*255).toFixed(), 
        (g*255).toFixed(), 
        (b*255).toFixed(), 
        (+a).toFixed(1)
    ]
}

const rgba255 = (rgba) => {
    return 'rgba(' + matchrgba(rgba).join(',') + ')'
}

module.exports = rgba255