const ICON_MAP = (name, tempFrame, Fill) => {
  let tempFill = Fill
  // 计算 icon 尺寸， 以边长大的为标准
  const iconSize = () => {
    let { width, height } = tempFrame
    return +width > +height ? +width : +height
  }

  // icon类型
  const tempIcon = { z: 1000, name: 'icon_button' }

  // 配置默认颜色
  const DEFAULT_COLOR = {
    blue: '#C7C7CC',
    white: '#FFF',
    black: '#000'
  }

  // 配置默认 icon 名称 （用于未匹配到的icon)
  const DEFAULTICON = 'md-message'

  // 匹配icon 名称
  const ICON_NAME = {
    'Refresh':      'fa-repeat',
    'Search Icon':  'ci-yql-search',
    'Clear':        'mb-times-circle-filled',
    'Arrow':        'fa-angle-right',
    'Icon':         'mb-widget-icon-label',
    'icon-share':   'md-share',
    'icon-uploda':  'md-cloud_upload',
    'icon-copy':    'md-content_copy',
    'icon-print':   'md-print',
    'mic':          'md-mic',
    'search':       'md-search',
    'icon-more':    'md_more_vert',
    'Back':         'fa-angle-left',
    'icon-arrow':   'md-arrow_drop_up',
    'icon-menu':    'md-menu',
    'icon-more':    'md-more_vert',
    'icon-reply':   'md-reply',
    'icon-archive': 'md-archive',
    'icon-add':     'mb-plus'
  }

  if(name == 'icon-more' || name == 'icon-menu' || name == 'icon-add') {
    tempFill = {bg: DEFAULT_COLOR.white}
  }
  if(name == 'icon-reply' || name == 'icon-archive') {
    tempFill = {bg: DEFAULT_COLOR.black, o: 54}
  }

  let ICON_COLOR = {
    tc: tempFill && tempFill.bg,
    o: tempFill && tempFill.o || 100
  }

  if (name == 'Arrow') {
    // 这里需要定制化
    let { left, top } = tempFrame
    tempFrame = { ...tempFrame, left: left - 5, top: top - 2, tc: DEFAULT_COLOR.blue }
  }

  if(name == 'Back') {
    let {left, top } = tempFrame
    tempFrame = {...tempFrame, left: left, top: top - 3,}
  }
  const DEFAULT_CONFIG = { is: iconSize(), ...tempFrame, ...tempIcon }
  
  // 针对未匹配到的icon 都给一个默认图标
  if(ICON_NAME[name] == undefined) {
    ICON_NAME[name] = DEFAULTICON
  }

  if (tempFill) {
    return { icon: ICON_NAME[name], ...DEFAULT_CONFIG, ...ICON_COLOR }
  } else {
    return { icon: ICON_NAME[name], ...DEFAULT_CONFIG }
  }
}

export default ICON_MAP