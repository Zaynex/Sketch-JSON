import { rgb } from './rbgax255'

const filterFill = ({fills}) => {
    
    const [{
        color: {
            value
        }
    }] = fills
    if(~value.indexOf('rgba')) {
        return rgb(value)
    }
    /**
     * bg: backgroundColor
     */
    return {
        bg: value
    }
}

module.exports = filterFill