# Clean Code

保持良好的习惯和编程规范变得很重要，所以最近啃了一下《Clean Code》，随手做一些摘录。大家一起学习。

## 关于注释

- 注释的定位顶多是一种“必须的恶”而非“纯然地好”，它只能弥补我们在用代码表达意图时遭遇的失败。简而言之，注释是一种失败。

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
- 实体变量应该在类的顶部声明（至少 Java 中是）。（ps：但是现在也有将私有变量放在共有对象、方法下面的，都有道理，看公司约定即可）
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
- 应该将缺乏模块组织行的代码从正常运行时逻辑中分离出来，确保拥有解决主要以来问题的全局性一贯策略。

- 分解 main
- 工厂
- 依赖注入（可以实现分离构造与使用），控制反转（IoC）在依赖管理中的一种应用手段。

### 扩容

- 软件系统与物理系统可以类比，他们的架构都可以递增式增长，只要我们持续将关注面恰当地切分。

## 迭进

- `简单设计`的四条规格：
  1.  运行所有测试；
  2.  不可重复；
  3.  表达了程序员的意图；
  4.  尽可能减少类和方法的数量；

## 并发变成

- 对象是过程的抽象，现成是调度的抽象。
- 并发是一种解耦策略。它帮我们把做`什么（目的）`和`何时（时机）`做分解开

### 并发的挑战

```Java
public class X {
    private int lastIdUsed;
    public int getNextId(){
        return ++lastIdUsed;
    }
}
```

如果创建 X 的一个实体，将 lastIdUsed 设置成 42，在两个线程中共享这个实体，都调用这个`getNextId`方法，可能有三种输出：

1.  线程 1 得到 43，线程 2 得到 44，lastIdUsed 为 44；
2.  线程 1 得到 44，线程 2 得到 43，lastIdUsed 为 44；
3.  线程 1 得到 43，线程 2 得到 43，lastIdUsed 为 43；

### 并发防御原则

1.  单一权责原理（分离并发相关代码及其他代码）
2.  限制数据作用域（谨记数据封装；严格限制对可能被共享的数据的访问）
3.  使用数据副本（值得试验一下看看额外创建对象的成本）
4.  线程应该尽可能独立（尝试将数据分解到可被独立线程——可能在不同处理器上——操作的独立子集）

### 了解执行模型

1.  生产者-消费者模型（Producer-consumer）
2.  读者-作者模型（Reader-writers）
3.  宴席哲学家(Dining philosophers problem)

### 保持同步区域微小

### 编写正确的关闭代码（尽早考虑关闭问题，这可能比你想象中难的多）

### 测试线程代码

1.  将伪失败看做可能是线程的问题；
2.  先使非线程代码可工作；
3.  编写可插拔的线程代码；
4.  编写可调整的线程代码；
5.  运行多于处理器数量的线程；
6.  在不同平台上运行；
7.  调整代码并强迫错误发生；

## 味道与启发

以下特征的代码让人觉得`闻起来不舒服`，注：有些条目是不应该如此，后面一些条目是最好如此，其实逻辑没有理得很干净。

### 注释

- 不恰当的信息：注释只应该描述有关代码和设计的技术性信息；
- 废弃的注释：过时、无关或不正确的注释就是废弃的注释，最好尽快更新或删除；
- 冗余的注释：注释应谈及自身没提到的东西；
- 糟糕的注释：使用正确的语法和拼写；
- 注释掉的代码：直接删掉；

### 环境

- 需要多步才能实现的构建；
- 需要多步才能做到的测试；

### 函数

- 过多的参数：避免三个以上的参数；
- 输入函数：应当修改他所在对象的状态（OOP 思路）；
- 标识参数：不要 flag；
- 死函数：删掉；

### 一般性问题

- 一个源文件中存在多种语言：应当尽量减少；
- 明显的行为未被实现：遵循`最小惊异原则（The Principle of Least Surprise）`；
- 不正确的边界行为：别依赖直觉，追索每种边界条件，并编写测试；
- 忽视安全：尽量减少关闭某些编译器警告的行为；
- 重复：（DRY，don’t repeat yourself），重复代码应抽象出来；
- 在错误的抽象层级上的代码：所有较低层级概念放在派生类中，所有较高层级概念放在基类中；
- 基类依赖于派生类：
- 信息过多
- 死代码：删掉不执行的代码；
- 垂直分割：变量和函数应该在靠近被使用的地方定义。本地变量应该正好在其首次被使用的位置上面声明，垂直距离要端；
- 前后不一致：小心选择约定，一旦选中，就小心持续遵循，能让代码更加易于阅读和修改；
- 混淆视听：
- 人为耦合：不互相依赖的东西不该耦合；
- 特性依恋：类的方法只应对其所属勒种的变量和函数感兴趣，不该垂青其他类中的变量和函数；
- 选择算子参数：类似 flag 的行为，应该拆分函数；
- 晦涩的意图：用了大量缩写，短小，不可捉摸，应该花时间将代码的意图呈现给读者；
- 位置错误的权责：最小惊异原则，代码应该放在读者自然而然期待他的地方；
- 不恰当的静态方法：通常应该倾向于选用非静态方法，如果需要静态方法，确保没机会打算让他有多态行为；
- 使用解释性变量：让程序可读的最有力方法之一就是将计算过程打散成有意义的单词命名的变量中放置的中间值；
- 函数名称应该表达其行为：
- 理解算法：很多可笑代码的出现，是因为人们没有花时间去理解算法。他们硬塞进去足够多的 if 语句和标识，从不停下来考虑发生了什么，勉强让系统能工作；
- 把逻辑依赖改为物理依赖：
- 用多态替代 if/else 或 switch/case ：对于给定的选择类型，不应有多于一个 switch 。多个 switch/case 的情况下，必须创建多态来取代系统中其他 switch 语句；
- 遵循标准约定；
- 用命名常量替代魔术数：在代码中出现原始形态的数字通常来说就是坏现象，应该用良好命名的常量来隐藏；魔术数不仅说数字，它泛指任何不能自我描述的符号；
- 精确：比如用浮点数标示货币几近于犯罪~
- 结构甚于约定：命名约定很好，但却次于强制性的结构；
- 封装条件：没有 if 或 while 语句的上下文，布尔逻辑就难以理解。应该把解释了条件意图的函数抽离出来；
- 避免否定性条件：否定式要比肯定是难明白一点，尽可能将表达式表示为肯定形式；
- 函数只该做一件事；
- 掩蔽时序耦合：排列函数参数，好让它们被调用的次序显而易见；
- 别随意
- 封装边界条件：将处理边界条件的代码集中到一处，不要散落于代码中，不要四处看见散落的 +1/-1 字样；
- 函数应该只在一个抽象层级上
- 在较高层级放置可配置数据；
- 避免传递浏览：不要这样`a.getB().getC().doSomething()`...

### Java 相关（特性有点老了，我不一一详细摘录）

- 通过使用通配符避免过长的导入清单；
- 不要继承常量；
- 使用枚举（enum）替代常量

### 名称

- 采用描述性名称；
- 名称应与抽象层级相符；
- 尽可能使用标准命名法：对于特定项目，开发团队常常发明自己的明明标准系统（共同语言），代码应该使用这种语言的术语；
- 无歧义的名称：相比含糊不清，名字太长也不是什么大问题；
- 为较大作用范围选用较长名称：名称长度应和作用范围的广泛度相关，`i`,`j`之类的变量作用在 5 行之内的情形没问题；
- 避免编码：不应在名称中包括类型或作用范围信息，`m_`或`f`之类的前缀完全无用，不要用匈牙利语命名法污染你的名称；
- 名称应该说明副作用；

### 测试

- 测试不足；
- 使用覆盖率工具；
- 别略过小测试；
- 被忽略的测试就是对不确定事物的疑问；
- 测试边界条件；
- 全面测试相近的缺陷；
- 测试失败的模式有启发性；
- 测试覆盖率的模式有启发性；
- 测试应该快速

## 结束 沉迷测试（Test Obsessed）
