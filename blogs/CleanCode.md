# Clean Code

从原来一个人单打独斗到现在有人 review 代码的时候，保持良好的习惯和编程规范变得很重要了，所以最近啃了一下《Clean Code》，随手做一些摘录。

## 关于注释

- 注释的定位顶多是一种“必须的恶 ”而非“纯然地好”，它只能弥补我们在用代码表达意图时遭遇的失败。简而言之， 注释是一种失败。

- 能够保留的注释只有以下原因：
  1.  法律信息
  2.  提供信息的注释
  3.  对意图的解释
  4.  阐释
  5.  警示
  6.  TODO
  7.  放大
  8.  ApiDoc

## 格式

### 垂直格式

- 在封包声明、导入声明和每个函数之间，都有空白行隔开，表示出新的独立概念。
- 但是也不要每一行都空，因为这样会造成阅读的不便。
- 变量声明应该尽可能靠近其使用的位置。
- 实体变量应该在类的顶部声明（至少 Java 中是）。
- 相关函数（一个函数调用了另一个），应该把它们放在一起，调用者应尽可能放在被调用者上面。
- 概念相关的代码应该放在一起。
- 垂直顺序：最重要的概念先出来，底层细节最后出来。

### 横向格式

- 宽度小于 120。
- 赋值（等）操作符周围加上空格以达到强调的目的。
- 在一些短小的 if、while 语句尽量加上缩进。
- 尽量少使用空范围（while 或者 for 的语句体为空），如果一定要使用，那么把分号放在另一行。

## 对象和数据结构

### 数据抽象

- 不要乱加取值器、赋值器（getter，setter），尽量以抽象形态表达数据，不要暴露数据细节，使用户无需了解数据的实现就能操作数据本体。举例：

```Java
// 具象机动车
public interface Vehicle {
    double getFuelTankCapacityInGallons();
    double getGallonsOfGasoline();
}

// 抽象机动车
public interface Vehicle {
    double getPercentFuelRemaining();
}
```

### 数据和对象的反对称性

- 过程式代码（使用数据结构的代码，ps 我认为就是不在数据结构中定义方法）便于在不改动既有数据结构的前提下添加新函数；面向对象代码便于在不改动既有函数的前提下添加新类。

### The Low of Demeter

- 模块不应了解它所操作`对象`的内部情形。对象不应该通过存取器直接暴露其内部结构。
- 比如，类 C 的方法 f 只应该调用以下对象的方法：
  - C；
  - 由 f 创建的对象；
  - 作为参数传递给 f 的对象；
  - 由 C 的实体变量持有的对象。
- 火车失事：

  ```Java
      // 火车失事：连串的调用
      final String outputDir = ctxt.getOptions().getScratchDir().getAbsolutePath();

      // 应该切分
      Options opts = ctxt.getOptions();
      File scratchDir = opts.getScratchDir();
      final String outputDir = scratchDir.getAbsolutePath();

      // 当然最好应该封装在ctxt对象来做所有事
      BufferOutputStream bos = ctxt.createScratchFileStream(classFileName);
  ```

## 错误处理

## 边界（第三方代码的使用、整理）

## 单元测试

### TDD 三条定律：

    1. 在编写不能通过的单元测试前，不可编写生产代码。
    2. 只可编写刚好无法通过的单元测试，不能编译也算不通过。
    3. 只可编写刚好足以通过当前失败测试的生产代码。

### 测试整洁

- 测试代码和生产代码一样重要
- 测试代码的可读性甚至比生产代码中还要重要，要明确、简介，充满表达力。
- 五条规格（F.I.R.S.T）：快速（fast）、独立（independent）、可重复（repeatable）、自足验证（self-validating）、及时（timely）

## 类

### 组织

- Java 中，类从一组变量列表开始（公共静态常量，然后私有静态变量，和实体变量）

## 系统

### 将构造与使用分开
    - 软件系统应将起始过程和起始过程之后的运行时逻辑分离开，在起始过程中构建应用对象，也会存在互相缠结的依赖关系。
    