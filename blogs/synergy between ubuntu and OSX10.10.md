#synergy compiling between ubuntu and OSX10.10


https://github.com/synergy/synergy/wiki/Compiling#Mac_OS_X_1010_and_above



先从github上下载源码https://github.com/synergy/synergy

按照wiki上提示的依赖安装CMAKE...



OS X 10.10 因为gt目录更改需要修改以下内容

Fix ./ext/toolchain/commands1.py:
```
In the function configure\_core() at approx line 433, change elif sys.platform == "darwin":  to read if sys.platform == "darwin":
```
```
In the function macPostGuiMake() at approx line 770 and/or 773 change the path to be what your Qt library path is, probably frameworkRootDir = "/usr/local/Cellar/qt/4.8.7/Frameworks"
```
```
 ./hm.sh conf -g1 [-d] # Use -d to build a debug version.
 ./hm.sh build [-d]
```
build完在bin里的就生成里app，直接能用。简单配置一下就能共享鼠标键盘和剪贴板，非常方便，文本共享不用scp不用

IM，直接复制粘贴就行了。另外 MAC 把app拖到application然后需要enable access for assistive devices  在设置security&privacy-Accessibility就行。



我是把ubuntu当服务器，mac当客户端，键盘鼠标用的是通用的，所以在mac下command是windows键，键位会有点不习惯，而且在mac下鼠标滑轮和正常windows是一样的，所以会有点奇怪。另外不知道是网络问题还是什么问题，光标在mac里会有闪烁的情况。



不过我还是建议不差钱的去官网下release版本的，10美元也不算多。