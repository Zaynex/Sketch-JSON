1. 分析每部分 JSON 数据的含义
2. 提取可用的关键字导出相应的样式

### 实现细节
1. 展开数据，使其所有 layers 位于同一层级
2. 给每个 layers 增加一个 zIndex 属性，值是通过遍历的次数去获取


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
ds: drop-shadow width
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
```