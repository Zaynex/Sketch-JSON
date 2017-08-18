import getTextDescription from './getTextDescription'
import getComponentType from './getComponentType'
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
    if (!style.shadows || style.shadows.length == 0) {
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

const getBorders = ({ borders }) => {
    if (borders && borders.length) {
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
    if (!fills || !fills.length === 0) return
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
    getComponentName,
    getTextDescription,
    getComponentType,
    getBorders,
    getShadow,
    getBackground,
    getFourBorderRadius
}