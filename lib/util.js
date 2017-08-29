import { rgb } from './rbgax255'

const getFrame = (frame) => {
  const { width, height, x, y } = frame
  return {
    width: Math.round(width),
    height: Math.round(height),
    left: Math.round(x),
    top: Math.round(y)
  }
}

const getShadow = (style) => {
  const { shadows } = style
  if (!shadows || shadows.length == 0) {
    return
  }
  /**
   * 注意，这里的 shadows 数组组成，会有一个叠加的效果,但前端只能渲染其中一个
   * 解决方案: 制定一套统一的阴影规则在 sketch 中
   */
  const [
    {
            spread,
      color: { value },
      offsetX,
      offsetY,
      blurRadius
        }
  ] = shadows
  return {
    sc: value,
    shadowOffsetX: offsetX,
    shadowOffsetY: offsetY,
    blurRadius: blurRadius,
    spread: spread,
    // default config ---> 2
    ds: 2
  }
}

/**
 * 对于rectangle 而言就是border，但是对于文本框而言，就是描边
 * thickness 表示的是文本的粗细
 * bc: 文本的颜色
 */
const getBorders = ({ borders }, type, name) => {
  if (borders && borders.length && type != 'text_view' && name != 'indicator' && name != 'highlight' && name != 'card' && name != 'icon-add bg') {
    const [{ color: { value }, thickness }] = borders
    /**
     * bc: borderColor,
     * bs: borderWidth
     */
    return {
      bc: value === '#979797' ? '#FFF' : value,
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
