import {rgba255} from './rbgax255'
import { TextVerticalAlign, TextAlign} from './default'
const getTextDescription = (attributedString) => {
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
            // NSColor: {
            //     color
            // },
            NSColor,
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
    let color = NSColor && NSColor.color
    console.log('text-color', rgba255(color))
    return {
        tc: color && rgba255(color),
        text: text,
        fs: NSFontSizeAttribute,
        lh: maximumLineHeight === 0? 'auto': maximumLineHeight,
        wordSpcing: NSKern,
        va: TextVerticalAlign[ MSTextStyleVerticalAlignment] || 'baseline',
        ha: TextAlign[alignment] || TextAlign[0]
    }
}

module.exports = getTextDescription