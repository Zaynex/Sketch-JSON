import { defaultColor } from './default'

const _getBorder = (borders) => {
    if(boders && borders.length) {
        const [{color: {value}, thickness}] = borders
        return {
            bs: value || defaultColor,
            bs: thickness || 0
        }
    }
}

const _getShdows = (shadows) => {
    if(shadows) {
        const [{
            color:{value},
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
}

const _getBackgroundColor = (fills) => {
    if(fills) {
        const [{
            color: {
                value
            }
        }] = fills
        return {
            bg: value
        }
    }   
}

const getStyle = (style) => {
    const {
        borders,
        shadows,
        fills
    } = style
    /**default config */
    let borderStyle = Object.assign({bs: 0}, _getBorder(borders))
    let shadowStyle = _getShdows(shadows)
    let fillStyle = _getBackgroundColor(fills)
    return {
        ...borderStyle,
        ...shadowStyle,
        ...fillStyle
    }
}


module.exports = getStyle