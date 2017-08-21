import { rgb } from './rbgax255'

const getFrame = (frame) => {
    const { width, height, x, y } = frame
    return {
        width: (+width).toFixed(),
        height: (+height).toFixed(),
        left: x,
        top: y
    }
}

const getShadow = (style) => {
    const { shadows } = style
    if (!shadows || shadows.length == 0) {
        return
    }
    const [{
            color: { value },
        offsetX,
        offsetY
        }
    ] = shadows
    return {
        shadowColor: value,
        shadowOffsetX: offsetX,
        shadowOffsetY: offsetY
    }
}

/**
 * 对于rectangle 而言就是border，但是对于文本框而言，就是描边
 * thickness 表示的是文本的粗细
 * bc: 文本的颜色
 */
const getBorders = ({ borders }, type, name) => {
    if (borders && borders.length && type != 'text_view' && name != 'indicator' && name != 'highlight' && name != 'card') {
        const [{ color: { value }, thickness }] = borders
        /**
         * bc: borderColor,
         * bs: borderWidth
         */
        return {
            bc: value,
            bs: thickness
        }
    }
    else { return { bs: 0 } }
}

const getBackground = ({ fills }) => {
    if (!fills || fills.length === 0) return
    const [{ color: { value } }] = fills
    if (~value.indexOf('rgba')) {
        return rgb(value)
    }
    /**
     * bg: backgroundColor
     */
    return { bg: value }
}

const getFourBorderRadius = path => {
    const { points: [{
        cornerRadius
    }] } = path
    let borderRadius = []
    path.points.forEach((v) => {
        borderRadius.push(v.cornerRadius)
    })
    /**
     * br: border-radius
     */
    return { br: cornerRadius, allborder: borderRadius }
}

/**
 * 返回组件在 sketch 中的 类型名称
 */
const getComponentName = (name) => {
    return { title: name }
}

const arrayToObject = (array) =>
    array.reduce((obj, item) => {
    obj[item.name] = item
    return obj
    }, {})

module.exports = {
    getFrame,
    getShadow,
    getBorders,
    getComponentName,
    getFourBorderRadius,
    getBackground
}
