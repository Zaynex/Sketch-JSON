const ICON_MAP = (name, tempFrame, Fill, tempBorders) => {
  let tempFill = Fill
  // 计算 icon 尺寸， 以边长大的为标准
  const iconSize = () => {
    let { width, height } = tempFrame
    return +width > +height ? +width : +height
  }

  // icon类型
  const tempIcon = { z: 100, name: 'icon_button' }

  // 配置默认颜色
  const DEFAULT_COLOR = {
    blue: '#C7C7CC',
    white: '#FFF',
    black: '#000'
  }

  // 配置默认 icon 名称 （用于未匹配到的icon)
  const DEFAULTICON = 'md-star'
  const IOS =  'ios-icon-'
  const And = 'and-icon-'
  // 匹配icon 名称
  const ICON_NAME = {
    [IOS + 'refresh']: 'fa-repeat',
    [IOS + 'search']:  'ci-yql-search',
    [IOS + 'clear']:   'mb-times-circle-filled',
    [IOS + 'back']:    'fa-angle-left',
    [IOS + 'more']:    'fa-angle-right',
    [And + 'share']:   'md-share',
    [And + 'upload']:  'md-cloud_upload',
    [And + 'copy']:    'md-content_copy',
    [And + 'print']:   'md-print',
    [And + 'mic']:     'md-mic',
    [And + 'more']:    'md-more_vert',
    [And + 'back']:    'fa-angle-left',
    [And + 'arrow']:   'md-arrow_drop_up',
    [And + 'menu']:    'md-menu',
    [And + 'reply']:   'md-reply',
    [And + 'archive']: 'md-archive',
    [And + 'add']:     'mb-plus',
    [And + 'back']:    'md-details',
    [And + 'home']:    'md-panorama_fish_eye',
    [And + 'recent']:  'md-crop_square',
    [And + 'gplus']:   'fa-google-plus-official',
    [And + 'hangouts']:'fa-commenting',
    [And + 'gmail']:   'fa-envelope-o',
    [And + 'message']: 'md-chat_bubble',
    [And + 'mail']:    'md-mail',
    [And + 'search']:  'md-search',
    [And + 'add']:     'md-add'
  }

  let ICON_COLOR = {
    tc: tempFill && tempFill.bg,
    o: tempFill && tempFill.o || 100
  }
  if(name == 'and-icon-more') {
    let { height , left, width } = tempFrame
    const fix = Math.round(Math.abs(height - width) / 2)
    tempFrame = {...tempFrame, width: height, left: left - fix}
  }
  if(name == 'ios-icon-back' || name == 'ios-icon-more' || name == 'and-icon-arrow') {
    let {left, top } = tempFrame
    let is = 24
    if(name == 'ios-icon-back') tempFrame = {...tempFrame, top: top - 2, is:32 }
    if(name == 'ios-icon-more') tempFrame =  {...tempFrame, top: top -1, is: 22}
    else {
      tempFrame = {...tempFrame, is: is}
    }
  }

  if(name == 'and-icon-home' || name == 'and-icon-back' || name == 'and-icon-recent') {
    console.log(tempBorders.bc)
    ICON_COLOR.tc = tempBorders.bc
  }

  let DEFAULT_CONFIG = { is: iconSize(), ...tempFrame, ...tempIcon }

  if(name == 'and-icon-back') {
    DEFAULT_CONFIG = Object.assign(DEFAULT_CONFIG, {ro: 90})
  }
  // 针对未匹配到的icon 都给一个默认图标
  if(ICON_NAME[name] == undefined) {
    ICON_NAME[name] = DEFAULTICON
  }

  if (tempFill || tempBorders) {
    return { icon: ICON_NAME[name], ...DEFAULT_CONFIG, ...ICON_COLOR }
  } else {
    return { icon: ICON_NAME[name], ...DEFAULT_CONFIG }
  }
}

export default ICON_MAP