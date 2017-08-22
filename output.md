## 规范命名
### 圆角图标
1. 凡是圆形图标都命名为 avatar/Oval 放着图片的占位符
2. 如果是 icon， 那就规范为 `icon-` 开头

### Mask
用于最外层的遮罩，含边框

### Line
Line 用 rectangle 

## 维护
1. 默认情况下，行高和高是相等，通过计算判断，使用 label 还是 text_view


## BUG
1. 粘贴时，图标库的搜索框也会监听事件

## 样式案例
```
{
    frame, // 位置大小
    style: {
        textStyle: {
            NSFont:{
                attributes: {
                    FontSize,
                    FontFamily
                }
            },
            NSParagraphStyle: {
                style:{
                    alignment,
                    lineSpacing,
                    maximumLineHeight
                }
            },
            NSColor: {
                color: 'rbga'
            }
        }
    }
}
```
### 需要导出的样式：
```
name: 组件类型，比如（lable, text)
text: 文字内容
icon: 图标
top:  Y
left: X
width: W
height: t
fs: Font Size
br: border redius
bs: border width
ha: 文字水平对齐
va: 文字垂直对齐
z:  z-index
lh: line-height
o:  opacity
ds: drop-shadow width(阴影)
sc: drop-shadow color
bg: background-color
tc: text-color
bc: border color
bo: bold
i:  italic
td: text decoration
ts: text-shadow width
tsc: text-shadow color
padding: padding
ls: border-style
is: icon-size 可以直接用 width/height 代替
i: 是否斜体
tc: icon-color
```