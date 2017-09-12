const getHexValue = (input) => {
  let result = input.toString(16)
  if (result.length < 2) {
    result = '0' + result
  }
  return result
}

const toHex = ([red, green, blue]) => {
  return getHexValue(red) + getHexValue(green) + getHexValue(blue)
}

const convertToHex = (color, bgColor) => {
  const [r, g, b, a] = color
  const [b_r, b_g, b_b, b_a] = bgColor

  return [getTintValue(a, r, b_r), getTintValue(a, g, b_g), getTintValue(a, b, b_b)]
}
const getTintValue = (alpha, tint, bgTint) => {
  let tmp = Math.floor((1 - alpha) * bgTint + alpha * tint)
  return tmp > 255 ? 255 : tmp
}

class ColorStringParser {
  constructor (color) {
    this.color = color
  }

  rgba () {
    let splittedRgba = this.color
    if (splittedRgba.includes('rgb')) {
      let index = splittedRgba.indexOf('(')
      splittedRgba = splittedRgba.slice(index + 1, - 1).split(',')
    }
    return [
      parseInt(splittedRgba[0], 10),
      parseInt(splittedRgba[1], 10),
      parseInt(splittedRgba[2], 10),
      parseFloat(splittedRgba[3], 10) || 1
    ]
  }

  hex () {
    let hexString = this.color.replace('#', '')
    let rgbArr = []
    for (let i = 0; i < hexString.length; i++) {
      rgbArr.push(parseInt(getHexPartByIndex(hexString, i), 16));
    }
    return [
      rgbArr[0],
      rgbArr[1],
      rgbArr[2],
      1
    ]
  }
  /**hsla 未经测试 */
  hsla () {
    let hsla = this.color.replace('hsla(', '')
      .replace('hsl(', '')
      .replace(')', '')
      .replace(' ', '')
      .split(',')

    let h = parseInt(hsla[0], 10) / 360
    let s = parseInt(hsla[1], 10) / 100
    let l = parseInt(hsla[2], 10) / 100
    let a = parseFloat(hsla[3], 10) || 1

    let r, g, b
    if (s == 0) {
      r = g = b = l
    } else {
      let q = l < 0.5 ? l * (1 + s) : l + s - l * s
      let p = 2 * l - q
      r = hue2rgb(p, q, h + 1 / 3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1 / 3)
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), a]
  }
}
const getHexPartByIndex = (hexString, index) => {
  switch (hexString.length) {
    case 3:
      return hexString[index] + hexString[index]
    default:
      index *= 2
      return hexString[index] + hexString[index + 1]
  }
}

const hue2rgb = (p, q, t) => {
  if (t < 0) t += 1
  if (t > 1) t -= 1
  if (t < 1 / 6) return p + (q - p) * 6 * t
  if (t < 1 / 2) return q
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
  return p
}

const getColorType = (colorString) => {
  if (colorString.indexOf('rgba') !== -1 || colorString.indexOf('rgb') !== -1) {
    return 'rgba'
  }
  if (colorString.indexOf('hsla') !== -1 || colorString.indexOf('hsl') !== -1) {
    return 'hsla'
  }
  return 'hex'
}

// Convenience function that returns the Color object for the given inputString.
const getColorForString = (inputString) => {
  let tmp = getColorType(inputString)
  let color = new ColorStringParser(inputString)[tmp]()
  return color
}
const rgba2Hex = (rgba) => {
  let rgbaColor = getColorForString(rgba)
  const defaultColor = '#FFFFFF'
  let backgroundColor = getColorForString(defaultColor)
  if (rgbaColor[3] <= 1) {
    rgbaColor = convertToHex(rgbaColor, backgroundColor)
  }

  let hex = '#' + toHex(rgbaColor)
  return hex
}

export default rgba2Hex


// console.log(rgba2hex('#123453'))
// console.log(rgba2hex('rgba(0, 0, 0,0.5)'))
// console.log(rgba2hex('rgb(222,222,11)'))

