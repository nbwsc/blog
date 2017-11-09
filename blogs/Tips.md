# SOME TIPS 

* itunesconnect github之类的网站在浏览器开启取消跨域限制后无法正常使用。

* node version 升级之后以前项目可能会报` cant find module 'internal/fs' ` 之类的问题，删掉node_modules然后重新`node install` 就可以。

* android crosswalk remote debug 需要开启
```
XWalkPreferences.setValue(XWalkPreferences.REMOTE_DEBUGGING, true);
```

* mongodb config `yaml` format

dont forget a space after `:`

* 腾讯云服务器 :theres no public ip you can config for your db ;
you should change host to 0.0.0.0

* remove all the links which not work 
```
find -L . -type l -delete
```

* 查看进程文件打开数
```
> netstat -n | awk '/^tcp/ {++S[$NF]} END {for(a in S) print a, S[a]}

> cat /proc/${PID}/limits
#这个命令可以查看该进程正在生效的limits

> lsof -n|awk '{print $2}'|sort|uniq -c |sort -nr|more 
```


* ionic2 action:tap and click 
    
    (click) is built in Angular 
    The (tap) event comes from the Hammer.js library. 

    If making mobile apps, (tap) might be better. This is because when using (click) the action always executes, even when tapping accidently. The (tap) won't execute if the user holds it for a longer period. And if you want to have a button that needs to be clicked for a longer period of time you can use the (press).

    Note that, as user pointed out, some ionic versions have a bug where the (click) action is not activated on iOS

* sublime mac os 下默认不会find the selected text
	只要在perferences中添加`"find_selected_text": true`
	

* ionic2 angular develop 

* install chrome in server

```
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
dpkg -i google-chrome-stable_current_amd64.deb
apt-get -f install
#需要server支持中文utf-8
sudo apt-get install language-pack-zh-hant language-pack-zh-hans
sudo vim /etc/environment
#LANG="zh_CN.UTF-8"
#LANGUAGE="zh_CN:zh:en_US:en"
#中文字显示方块，需要安装字体
sudo apt-get install fonts-droid ttf-wqy-zenhei ttf-wqy-microhei fonts-arphic-ukai fonts-arphic-uming
```

* Vue 中method this不是指向component的原因：不能用箭头函数
```
注意，不应该使用箭头函数来定义 method 函数 (例如 plus: () => this.a++)。理由是箭头函数绑定了父级作用域的上下文，所以 this 将不会按照期望指向 Vue 实例，this.a 将是 undefined。
```


* python 打包windows可执行exe文件时候使用pyinstaller和apschedule会遇到问题
[这个文章](http://www.cnblogs.com/ginponson/p/6079928.html)遇到的问题我都遇到了，按照他的做法能够解决

* python 3.6不被pyinstaller支持，换成pythong3.5，

* 结果python3.5不被vista以下版本windows支持，

    所以最后只能选用python3.4
    请不要和我说python2
    用python2不是和用xp一样么

* angular 1.x get Scope outside app(inject js) [blog](https://stackoverflow.com/questions/24595460/how-to-access-update-rootscope-from-outside-angular)

* ubuntu disable `super` key to open dash home
```
dconf write /org/compiz/profiles/unity/plugins/unityshell/show-launcher "'Disabled'"
```
