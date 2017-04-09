# golang learning note

### 短声明变量

在函数中， := 简洁赋值语句在明确类型的地方，可以用于替代 var 定义。

函数外的每个语句都必须以关键字开始（ var 、 func 、等等）， := 结构不能使用在函数外。

### 命名返回值
Go 的返回值可以被命名，并且就像在函数体开头声明的变量那样使用。

返回值的名称应当具有一定的意义，可以作为文档使用。

没有参数的 return 语句返回各个返回变量的当前值。这种用法被称作“裸”返回。

直接返回语句仅应当用在像下面这样的短函数中。在长的函数中它们会影响代码的可读性。

### 基本类型
Go 的基本类型有Basic types
```
bool

string

int  int8  int16  int32  int64
uint uint8 uint16 uint32 uint64 uintptr

byte // uint8 的别名

rune // int32 的别名
     // 代表一个Unicode码

float32 float64

complex64 complex128
```
这个例子演示了具有不同类型的变量。 同时与导入语句一样，变量的定义“打包”在一个语法块中。

int，uint 和 uintptr 类型在32位的系统上一般是32位，而在64位系统上是64位。当你需要使用一个整数类型时，你应该首选 int，仅当有特别的理由才使用定长整数类型或者无符号整数类型。

### 类型转换
表达式 T(v) 将值 v 转换为类型 T 。

一些关于数值的转换：
```
var i int = 42
var f float64 = float64(i)
var u uint = uint(f)
```
或者，更加简单的形式：
```
i := 42
f := float64(i)
u := uint(f)
```
与 C 不同的是 Go 的在不同类型之间的项目赋值时需要显式转换。 试着移除例子中 float64 或 int 的转换看看会发生什么。

### 常量
常量的定义与变量类似，只不过使用 const 关键字。

常量可以是字符、字符串、布尔或数字类型的值。

常量不能使用 := 语法定义。


### for
Go 只有一种循环结构—— for 循环。

基本的 for 循环包含三个由分号分开的组成部分：

初始化语句：在第一次循环执行前被执行
循环条件表达式：每轮迭代开始前被求值
后置语句：每轮迭代后被执行
初始化语句一般是一个短变量声明，这里声明的变量仅在整个 for 循环语句可见。

如果条件表达式的值变为 false，那么迭代将终止。

注意：不像 C，Java，或者 Javascript 等其他语言，for 语句的三个组成部分 并不需要用括号括起来，但循环体必须用 { } 括起来。


循环初始化语句和后置语句都是可选的。

基于此可以省略分号：C 的 while 在 Go 中叫做 for 。

### if
就像 for 循环一样，Go 的 if 语句也不要求用 ( ) 将条件括起来，同时， { } 还是必须有的。


* if 的便捷语句
跟 for 一样， if 语句可以在条件之前执行一个简单语句。

由这个语句定义的变量的作用域仅在 if 范围之内。

（在最后的 return 语句处使用 v 看看。）
```

func pow(x, n, lim float64) float64 {
	if v := math.Pow(x, n); v < lim {
		return v
	}
	return lim
}

```
if 和 else
在 if 的便捷语句定义的变量同样可以在任何对应的 else 块中使用。

（提示：两个 pow 调用都在 main 调用 fmt.Println 前执行完毕了。）
```
package main

import (
	"fmt"
	"math"
)

func pow(x, n, lim float64) float64 {
	if v := math.Pow(x, n); v < lim {
		return v
	} else {
		fmt.Printf("%g >= %g\n", v, lim)
	}
	// 这里开始就不能使用 v 了
	return lim
}

func main() {
	fmt.Println(
		pow(3, 2, 10),
		pow(3, 3, 20),
	)
}


```
switch
你可能已经知道 switch 语句会长什么样了。

除非以 fallthrough 语句结束，否则分支会自动终止。


```
package main

import (
	"fmt"
	"runtime"
)

func main() {
	fmt.Print("Go runs on ")
	switch os := runtime.GOOS; os {
	case "darwin":
		fmt.Println("OS X.")
	case "linux":
		fmt.Println("Linux.")
	default:
		// freebsd, openbsd,
		// plan9, windows...
		fmt.Printf("%s.", os)
	}
}

```



## 没有条件的 switch
没有条件的 switch 同 switch true 一样。

这一构造使得可以用更清晰的形式来编写长的 if-then-else 链。
```
package main

import (
	"fmt"
	"time"
)

func main() {
	t := time.Now()
	switch {
	case t.Hour() < 12:
		fmt.Println("Good morning!")
	case t.Hour() < 17:
		fmt.Println("Good afternoon.")
	default:
		fmt.Println("Good evening.")
	}
}
```

### defer 
defer 语句会延迟函数的执行直到上层函数返回。

延迟调用的参数会立刻生成，但是在上层函数返回前函数都不会被调用。

延迟的函数调用被压入一个栈中。当函数返回时， 会按照后进先出的顺序调用被延迟的函数调用。


## 指针
Go 具有指针。 指针保存了变量的内存地址。

类型 *T 是指向类型 T 的值的指针。其零值是 nil 。

var p *int
& 符号会生成一个指向其作用对象的指针。

i := 42
p = &i
* 符号表示指针指向的底层的值。

fmt.Println(*p) // 通过指针 p 读取 i
*p = 21         // 通过指针 p 设置 i
这也就是通常所说的“间接引用”或“非直接引用”。

与 C 不同，Go 没有指针运算。

```
package main

import "fmt"

func main() {
	i, j := 42, 2701

	p := &i         // point to i
	fmt.Println(*p) // read i through the pointer
	*p = 21         // set i through the pointer
	fmt.Println(i)  // see the new value of i

	p = &j         // point to j
	*p = *p / 37   // divide j through the pointer
	fmt.Println(j) // see the new value of j
}

## 结构体
一个结构体（ struct ）就是一个字段的集合。

（而 type 的含义跟其字面意思相符。）
```
package main

import "fmt"

type Vertex struct {
	X int
	Y int
}

func main() {
	fmt.Println(Vertex{1, 2})
}

///
type Vertex struct {
	X int
	Y int
}

func main() {
	v := Vertex{1, 2}
	v.X = 4
	fmt.Println(v.X)
}
```
```