const matchrgba = rgba => {
    let [r, g, b, a] = rgba.slice(5, -1).split(',')
    // 由于会返回需要 *255 和不需要处理的情况
    // console.log('rgba',[r, g, b, a])
    // 这种方式处理有会问题，当  rbg都为1的时候，没法判断是何种标准
    if ((+r) + (+g) + (+b) <= 3) {
        return [
            Math.round(r * 255),
            Math.round(g * 255),
            Math.round(b * 255),
            (+a).toFixed(2)
        ]
    } else {
        return [r, g, b, a]
    }

}
const rgb = (rbga) => {
    let [r, g, b, a] = matchrgba(rbga)
    // console.log(matchrgba(rbga))
    return {
        o: (a * 100).toFixed(),
        bg: rgb2hex('rgb(' + [r, g, b].join(',') + ')')
    }
}

const rgb2hex = (rgb) => {
    const result = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i)
    return (result && result.length === 4) ? "#" +
        ("0" + parseInt(result[1], 10).toString(16)).slice(-2) +
        ("0" + parseInt(result[2], 10).toString(16)).slice(-2) +
        ("0" + parseInt(result[3], 10).toString(16)).slice(-2) : rgb
}

// const rgba255 = (rgba) => {
//     // 返回默认值
//     if (!rgba || rgba.indexOf('rgba')) return "#FFF"
//     const [r, g, b, a] = rgba
//     return {}
//     return matchrgba(rgba).join('')
//     return 'rgba(' + matchrgba(rgba).join(',') + ')'
// }

module.exports = {
    rgb,
    rgb2hex
}