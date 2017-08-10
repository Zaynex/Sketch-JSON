import rgba255 from './rbgax255'
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
    return {
        tc: rgba255(color),
        text: text,
        fs: NSFontSizeAttribute,
        fontFamily: family,
        lh: maximumLineHeight === 0? 'auto': maximumLineHeight,
        wordSpcing: NSKern,
        va: TextVerticalAlign[alignment],
        ha: TextAlign[MSTextStyleVerticalAlignment]
    }
}

module.exports = filterTextDescription