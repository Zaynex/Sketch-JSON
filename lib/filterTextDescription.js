import {rgba255} from './rbgax255'
import { TextVerticalAlign, TextAlign} from './default'
const filterTextDescription = (attributedString) => {
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
            NSColor: {
                color
            },
            MSTextStyleVerticalAlignment,
            NSParagraphStyle: {
                style: {
                    maximumLineHeight,
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
     */
    console.log('text-color', color)
    return {
        tc: rgba255(color),
        text: text,
        fs: NSFontSizeAttribute,
        lh: maximumLineHeight === 0? 'auto': maximumLineHeight,
        wordSpcing: NSKern,
        va: TextVerticalAlign[ MSTextStyleVerticalAlignment] || 'baseline',
        ha: TextAlign[alignment] || TextAlign[0]
    }
}

module.exports = filterTextDescription