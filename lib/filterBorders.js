const filterBorders = ({ borders }) => {
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
    else {
        return {
            bs: 0
        }
    }
}

module.exports = filterBorders