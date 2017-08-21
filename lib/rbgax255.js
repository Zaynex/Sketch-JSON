const matchrgba = rgba => {
    let [r, g, b, a] = rgba.slice(5, -1).split(',')
    // 由于会返回需要 *255 和不需要处理的情况
    // console.log('rgba',[r, g, b, a])
    // 这种方式处理有会问题，当  rbg都为1的时候，没法判断是何种标准
    if((+r) + (+g) + (+b) <= 3) {
        return [
            (r*255).toFixed(), 
            (g*255).toFixed(), 
            (b*255).toFixed(), 
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
        o: (a*100).toFixed(),
        bg: 'rgb(' + [r, g, b].join(',') + ')'
    }
}
const rgba255 = (rgba) => {
    // 返回默认值
    if(!rgba || rgba.indexOf('rgba')) return "#FFF"
    return 'rgba(' + matchrgba(rgba).join(',') + ')'
}

module.exports = {
    rgba255,
    rgb
}