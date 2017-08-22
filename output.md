## 规范命名
### 圆角图标
1. 凡是圆形图标都命名为 avatar/Oval 放着图片的占位符
2. 如果是 icon， 那就规范为 `icon-` 开头

### Mask
用于最外层的遮罩，含边框

## 维护
1. 默认情况下，行高和高是相等，通过计算判断，使用 label 还是 text_view



## BUG
1. 粘贴时，图标库的搜索框也会监听事件

## sketch 规范
1. 圆角图标  App Icon
2. 图标 Icon
3. Line 规范


1. sketch 中部分文字显示不全，宽度的原因 (字体和宽度都有问题)
2. 每个传入的组件都会默认添加一个border，有border重叠的现象（我这边也可以手动删除）
3. 目前圆角可以设定所有的相同的值，没有太大顾虑。
4. 上层组件是圆，但是背景色在下层组件，需要拿到上层组件，然后不遍历下层组件
5. icon 图标选用，对于没有的，如何处理
6. edit menu: 比较hack的方式我这边处理，手动减去宽高，因为宽高是下一层计算出的，所以只能自己提前减一个固定的数值。

1. left top 依赖问题已解决

- word-break: 断行规则，默认是 normal 以单词划分
1. 如果是 break-all 则填满宽度后，字符间断行
2. keep-all, 文本不断行

- word-wrap（overflow-wrap）: 原本是微软的私有属性，已经在 css3规范中重命名为 overflow-wrap
定义规范是当一个不能被分开的字符串因太长而不能填充包裹盒时，为防止其溢出，浏览器是否允许这样的单词中断换行
默认值 normal: 在正常的单词结束处换行
break-word: 如果行内没有多余的地方容纳到该单词结尾，则那些正常的不能被分割的单词会被强制分割换行



## 样式
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