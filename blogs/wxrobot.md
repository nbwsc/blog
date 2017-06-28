# 微信机器人项目 wxrobot

`wechat` `robot`

最近因为业务需求所以在做微信个人号机器人相关(拉群/自动发送消息/自动应答/用户管理等功能)

我知道有web微信的存在肯定有http/https接口可以实现这些功能,而且github上肯定有人用各种实现已经做过了

于是在github上了几个开源项目
| 项目 | 说明 | 评价 |
|---|---|---|
|[youfou/wxpy](https://github.com/youfou/wxpy) | 优秀的api包装和配套插件，微信机器人/优雅的微信个人号API|[个人评价:5 支持python2/3 api包装不错 文档写的满分 基于itchat开发,也开放了itchat的原始数据接口,自由度和封装美化兼顾 ]　|
|[liuwons/wxBot](https://github.com/liuwons/wxBot)| 类似的基于Python的微信机器人 | [个人评价:4 不支持python3 utf-8支持不好 ]|
|[zixia/wechaty](https://github.com/Chatie/wechaty)|基于Javascript(ES6)的微信个人账号机器人NodeJS框架/库|[个人评价:5 如何把一个简单的东西做的很复杂教程]|
|[sjdy521/Mojo-Weixin](https://github.com/sjdy521/Mojo-Weixin)|使用Perl语言编写的微信客户端框架，可通过插件提供基于HTTP协议的api接口供其他语言调用 |[未使用]|
|[HanSon/vbot](https://github.com/hanson/vbot)|基于PHP7的微信个人号机器人，通过实现匿名函数可以方便地实现各种自定义的功能 |[未使用]
|[littlecodersh/ItChat](https://github.com/littlecodersh/ItChat)|wxpy就是基于此开发 |[个人评价:4] |


## about wechaty

这个项目的README真的是不能再完善，全英文书写，项目icon,持续集成，issue/wiki链接，Voice of the Developer(我觉得一些出书的人爱这么干，很少有开发者会把好评贴在readme里．最后发现作者确实是出书过的)，让人觉得比格很高．

还有`The World's Shortest ChatBot Code: 6 lines of JavaScript`．只有一个扫码登录的客户端我觉得一行一个`robot.init()`就够了吧．

Getting start 是一个youtube视频开头的图片，点进去以后不是油管．好吧，反正我现在还没看成这个视频．

＊　Docker环境
Docker是个好东西，但是这个HACK过来的接口库是不是有点用不太着一个单独的环境？难道是为了使用figlet？

＊　npm环境　也要来炫个技
｀｀｀
$ npm install wechaty

$ cat > mybot.js <<'_EOF_'
const { Wechaty } = require('wechaty')
const bot = Wechaty.instance()
console.log(bot.version())
_EOF_

$ node mybot.js
｀｀｀

## Test 持续集成
