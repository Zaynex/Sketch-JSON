import { rgb } from './rbgax255'
import { TextVerticalAlign, TextAlign } from './default'


const lineHeightConfig = (height, lh) => {
    // 对于单行，返回 1.2倍， 多行直接返回
    if (lh == 0 || height == lh) {
        return height * 1.2
    }
    return lh
}
const getTextDescription = (attributedString, { height }) => {
    const { value } = attributedString
    const {
        text,
        attributes: [{
            NSFont: {
                attributes: {
                    NSFontSizeAttribute
                },
            family
            },
            NSKern,
            NSColor,
            NSParagraphStyle: {
                style: {
                    maximumLineHeight,
                minimumLineHeight,
                lineSpacing,
                lineHeightMultiple,
                alignment
                }
            }
        }]
    } = value

    /**
     * tc: fontColor,
     * text: description,
     * fs: fontSize,
     * ha: text-align
     * va: vertical-align,
     * lh: lineHeight
     *
     */
    let color = NSColor && NSColor.color
    return {
        tc: rgb(color).bg,
        o: rgb(color).o,
        text: text,
        fs: NSFontSizeAttribute,
        lh: lineHeightConfig(height, maximumLineHeight),
        wordSpcing: NSKern,
        va: TextVerticalAlign[0],
        ha: TextAlign[alignment] || TextAlign[0]
    }
}

module.exports = getTextDescription