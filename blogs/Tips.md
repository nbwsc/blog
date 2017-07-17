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
