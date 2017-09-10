## 命名规范
致 UI

#### 图标
以`mb-icon-x` 开头命名,x为图标名称，以便对应图标库

#### image图标
目前没有强制规范格式，有如下格式:
- Avatar
- Oval_img
- Mask_img

希望以后能够统一以 `mb-img` 格式。

#### 线与矩形
如果是线，命名格式为
- `mb-line-va` 垂直线条
- `mb-line-ha` 水平线条

如果希望的线是矩形，则不应使用以上特殊标记。

#### 阴影
阴影存在多级设置的情况，但目前组件不支持，后期会支持该属性。
在 `mockingBot` 中默认值为 2。

## 维护
致 Coder

#### 文本
1. 如果是当行文本，则行高和高度是相等的,采用`label`。 但要求在`mockingBot`中显示 lineHeight * 1.2，反之则是多行文本，采用`text_view`。
2. 目前只能获取水平方向对齐情况，垂直方向对齐情况采用默认 `top` 的方式。

#### 线条
由于线条和实际在 `mockingBot` 渲染时会有差，需要给其添加`10px`的高度或者宽度，注意还需要计算相应的`left/top`位移

#### Icon
目前 Icon 设置大小值是 `font-size`, 选择 Icon 中宽度或者高度最大的一个作为最终值。

#### 颜色
1. 对于文本类型的字体可以单独设置透明度。所以，需要 `{opacity, font-color}` 两个。即`rgba`值
2. 对于矩形，需要将其 {opacity, background-color} 分开。
3. 对于阴影和边框，如果其颜色为 rgba，需要转换成 hex。 (参考 rgba2hex)

## 样式案例
```
{
    frame,
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
#### 需要导出的样式：
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
va: 文字垂直对齐(目前sketchtool 未携带)
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
is: icon-size
i: 是否斜体
tc: icon-color
```