# Swift学习笔记
[source](https://numbbbbb.gitbooks.io/-the-swift-programming-language-/content/chapter2/01_The_Basics.html)
## 基础类型
* Int Double Float
* Bool String 
* Array Set Dictionary Tuple

## 声明
常量和变量必须在使用前声明，用`let`来声明常量，用`var`来声明变量

## 类型标注
在常量或者变量名后面加上一个冒号和空格，然后加上类型名称
```
var welcomeMessage: String
```

## 变量命名可以使用Unicode字符（包括中文和表情符号。。。）

## 注释 
//和大多数语言一样

## 分号
非强制

## 整数
Swift 提供了8，16，32和64位的有符号和无符号整数类型。这些整数类型和 C 语言的命名方式很像，比如8位无符号整数类型是UInt8，32位有符号整数类型是Int32。就像 Swift 的其他类型一样，整数类型采用大写命名法。