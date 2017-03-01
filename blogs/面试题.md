## 多易时代 前端面试题

### 前端基础

* 常见的浏览器内核有哪些？
```
	Trident内核：IE,MaxThon,TT,The World,360,搜狗浏览器等。[又称MSHTML]
	Gecko内核：Netscape6及以上版本，FF,MozillaSuite/SeaMonkey等
	Presto内核：Opera7及以上。      [Opera内核原为：Presto，现为：Blink;]
	Webkit内核：Safari,Chrome等。   [ Chrome的：Blink（WebKit的分支）]
```
* 如何居中`div`？如何居中一个浮动元素？如何让绝对定位的`div`居中？
```
//水平居中：给div设置一个宽度，然后添加margin:0 auto属性

div{
    width:200px;
    margin:0 auto;
 }

//让绝对定位的div居中

div {
    position: absolute;
    width: 300px;
    height: 300px;
    margin: auto;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: pink; /* 方便看效果 */
}
```
* `display`有哪些值？说明他们的作用。
```
  block         块类型。默认宽度为父元素宽度，可设置宽高，换行显示。
  none          缺省值。象行内元素类型一样显示。
  inline        行内元素类型。默认宽度为内容宽度，不可设置宽高，同行显示。
  inline-block  默认宽度为内容宽度，可以设置宽高，同行显示。
  list-item     象块类型元素一样显示，并添加样式列表标记。
  table         此元素会作为块级表格来显示。
  inherit       规定应该从父元素继承 display 属性的值。
```
* `position`的值`relative`和`absolute`定位原点是？
```
  absolute
    生成绝对定位的元素，相对于值不为 static的第一个父元素进行定位。
  fixed （老IE不支持）
    生成绝对定位的元素，相对于浏览器窗口进行定位。
  relative
    生成相对定位的元素，相对于其正常位置进行定位。
  static
    默认值。没有定位，元素出现在正常的流中（忽略 top, bottom, left, right z-index 声明）。
  inherit
    规定从父元素继承 position 属性的值。
```
* CSS优先级算法如何计算？
```

*   优先级就近原则，同权重情况下样式定义最近者为准;
*   载入样式以最后载入的定位为准;

优先级为:
    同权重: 内联样式表（标签内部）> 嵌入样式表（当前文件中）> 外部样式表（外部文件中）。
    !important >  id > class > tag
    important 比 内联优先级高
```
* ["1", "2", "3"].map(parseInt) 答案是多少？
```
[ 1, NaN, NaN ]
parseInt() 函数能解析一个字符串，并返回一个整数，需要两个参数 (val, radix)，
其中 radix 表示要解析的数字的基数。【该值介于 2 ~ 36 之间，并且字符串中的数字不能大于radix才能正确返回数字结果值】;
但此处 map 传了 3 个 (element, index, array),我们重写parseInt函数测试一下是否符合上面的规则。

function parseInt(str, radix) {
    return str+'-'+radix;
};
var a=["1", "2", "3"];
a.map(parseInt);  // ["1-0", "2-1", "3-2"] 不能大于radix

因为二进制里面，没有数字3,导致出现超范围的radix赋值和不合法的进制解析，才会返回NaN
所以["1", "2", "3"].map(parseInt) 答案也就是：[1, NaN, NaN]
```
* `javascript`中如何解决回调地狱问题
```
promise generator async/await event...
```
* 如何判断当前脚本运行在`浏览器`还是`node`环境中？
```
this === window ? 'browser' : 'node';

通过判断Global对象是否为window，如果不为window，当前脚本没有运行在浏览器中

typeof process/global在node中为object ,浏览器中为undifined
```
* http状态码有那些？分别代表是什么意思？
```
  1**(信息类)：表示接收到请求并且继续处理
    100——客户必须继续发出请求
    101——客户要求服务器根据请求转换HTTP协议版本

  2**(响应成功)：表示动作被成功接收、理解和接受
    200——表明该请求被成功地完成，所请求的资源发送回客户端
    201——提示知道新文件的URL
    202——接受和处理、但处理未完成
    203——返回信息不确定或不完整
    204——请求收到，但返回信息为空
    205——服务器完成了请求，用户代理必须复位当前已经浏览过的文件
    206——服务器已经完成了部分用户的GET请求

  3**(重定向类)：为了完成指定的动作，必须接受进一步处理
    300——请求的资源可在多处得到
    301——本网页被永久性转移到另一个URL
    302——请求的网页被转移到一个新的地址，但客户访问仍继续通过原始URL地址，重定向，新的URL会在response中的Location中返回，浏览器将会使用新的URL发出新的Request。
    303——建议客户访问其他URL或访问方式
    304——自从上次请求后，请求的网页未修改过，服务器返回此响应时，不会返回网页内容，代表上次的文档已经被缓存了，还可以继续使用
    305——请求的资源必须从服务器指定的地址得到
    306——前一版本HTTP中使用的代码，现行版本中不再使用
    307——申明请求的资源临时性删除

  4**(客户端错误类)：请求包含错误语法或不能正确执行
    400——客户端请求有语法错误，不能被服务器所理解
    401——请求未经授权，这个状态代码必须和WWW-Authenticate报头域一起使用
    HTTP 401.1 - 未授权：登录失败
    　　HTTP 401.2 - 未授权：服务器配置问题导致登录失败
    　　HTTP 401.3 - ACL 禁止访问资源
    　　HTTP 401.4 - 未授权：授权被筛选器拒绝
    HTTP 401.5 - 未授权：ISAPI 或 CGI 授权失败
    402——保留有效ChargeTo头响应
    403——禁止访问，服务器收到请求，但是拒绝提供服务
    HTTP 403.1 禁止访问：禁止可执行访问
    　　HTTP 403.2 - 禁止访问：禁止读访问
    　　HTTP 403.3 - 禁止访问：禁止写访问
    　　HTTP 403.4 - 禁止访问：要求 SSL
    　　HTTP 403.5 - 禁止访问：要求 SSL 128
    　　HTTP 403.6 - 禁止访问：IP 地址被拒绝
    　　HTTP 403.7 - 禁止访问：要求客户证书
    　　HTTP 403.8 - 禁止访问：禁止站点访问
    　　HTTP 403.9 - 禁止访问：连接的用户过多
    　　HTTP 403.10 - 禁止访问：配置无效
    　　HTTP 403.11 - 禁止访问：密码更改
    　　HTTP 403.12 - 禁止访问：映射器拒绝访问
    　　HTTP 403.13 - 禁止访问：客户证书已被吊销
    　　HTTP 403.15 - 禁止访问：客户访问许可过多
    　　HTTP 403.16 - 禁止访问：客户证书不可信或者无效
    HTTP 403.17 - 禁止访问：客户证书已经到期或者尚未生效
    404——一个404错误表明可连接服务器，但服务器无法取得所请求的网页，请求资源不存在。eg：输入了错误的URL
    405——用户在Request-Line字段定义的方法不允许
    406——根据用户发送的Accept拖，请求资源不可访问
    407——类似401，用户必须首先在代理服务器上得到授权
    408——客户端没有在用户指定的饿时间内完成请求
    409——对当前资源状态，请求不能完成
    410——服务器上不再有此资源且无进一步的参考地址
    411——服务器拒绝用户定义的Content-Length属性请求
    412——一个或多个请求头字段在当前请求中错误
    413——请求的资源大于服务器允许的大小
    414——请求的资源URL长于服务器允许的长度
    415——请求资源不支持请求项目格式
    416——请求中包含Range请求头字段，在当前请求资源范围内没有range指示值，请求也不包含If-Range请求头字段
    417——服务器不满足请求Expect头字段指定的期望值，如果是代理服务器，可能是下一级服务器不能满足请求长。

  5**(服务端错误类)：服务器不能正确执行一个正确的请求
    HTTP 500 - 服务器遇到错误，无法完成请求
    　　HTTP 500.100 - 内部服务器错误 - ASP 错误
    　　HTTP 500-11 服务器关闭
    　　HTTP 500-12 应用程序重新启动
    　　HTTP 500-13 - 服务器太忙
    　　HTTP 500-14 - 应用程序无效
    　　HTTP 500-15 - 不允许请求 global.asa
    　　Error 501 - 未实现
  HTTP 502 - 网关错误
  HTTP 503：由于超载或停机维护，服务器目前无法使用，一段时间后可能恢复正常
```

### 逻辑实现题
* 实现千位分隔符(number => string),eg:12345.123=>"12,345.123"
```
//最好使用正则表达式
function commafy(num) {
    return num && num
        .toString()
        .replace(/(\d)(?=(\d{3})+\.)/g, function($0, $1) {
            return $1 + ",";
        });
}
```
* Add String 

Total Accepted: 24787
Total Submissions: 60185
Difficulty: Easy
Contributors: Admin
Given two non-negative integers num1 and num2 represented as string, return the sum of num1 and num2.

Note:

The length of both num1 and num2 is < 5100.
Both num1 and num2 contains only digits 0-9.
Both num1 and num2 does not contain any leading zero.
You must not use any built-in BigInteger library or convert the inputs to integer directly.
```
//字符串相加，模拟手算过程
var addStrings = function(num1, num2) {
	var l1 = num1.length,
		l2 = num2.length,
	    Maxlength = Math.max(l1, l2);

	var res = new Array(Maxlength);
	var jwflag = 0;
	for (var i = 1; i <= Maxlength; i++) {

		var t = (+num1[l1 - i]||0) + (+num2[l2 - i]||0)+jwflag;
		jwflag = 0;
		if (t > 9) {
			res[Maxlength - i] = t%10;
			jwflag = 1;
		}else{
			res[Maxlength - i ] = t;
		}
	}
	return jwflag?'1'+res.join(''):res.join('');
};
```

* First-bad-version

You are a product manager and currently leading a team to develop a new product. Unfortunately, the latest version of your product fails the quality check. Since each version is developed based on the previous version, all the versions after a bad version are also bad.

Suppose you have n versions [1, 2, ..., n] and you want to find out the first bad one, which causes all the following ones to be bad.

You are given an API bool isBadVersion(version) which will return whether version is bad. Implement a function to find the first bad version. You should minimize the number of calls to the API.
```
//使用折半查找
var solution = function(isBadVersion) {
    /**
     * @param {integer} n Total versions
     * @return {integer} The first bad version
     */
    return function(n) {
        var head = 1,
            tail = n,
            mid = Math.floor((head + tail)/2);
        while (head < tail-1) {
            if (isBadVersion(mid)) { //search left
                tail = mid;
                mid = Math.floor((head + tail)/2);
            }else{//right
                head = mid+1;
                mid = Math.floor((head + tail)/2);
            }
        }
        return isBadVersion(mid)?mid:tail
    };
};
```

* Two sum:

Given an array of integers, return indices of the two numbers such that they add up to a specific target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

Example:
Given nums = [2, 7, 11, 15], target = 9,

Because nums[0] + nums[1] = 2 + 7 = 9,
return [0, 1].
```
//使用哈希表不要遍历
var twoSum = function(nums, target) {
    var tmp = {}
    for(var i = 0 ; i < nums.length; i ++){
        if(tmp.hasOwnProperty([nums[i]])){
            return [tmp[nums[i]],i]
        }
        tmp[target - nums[i]] = i;
    }
};
```

### 简述题

* 选择一个你最擅长使用的框架，并简单讲讲它和同类框架相比有什么优缺点。

* 使用node js的新特性async/await实现一个同步的http请求

* 了解浏览器的跨域问题吗？如果遇到怎么解决？