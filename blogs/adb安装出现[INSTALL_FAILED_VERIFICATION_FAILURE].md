# adb install 出现 [INSTALL_FAILED_VERIFICATION_FAILURE] 的解决方法

有时候adb install 安装apk时会包[INSTALL_FAILED_VERIFICATION_FAILURE]，但是在android studio中可以安装

分析android studio的命令
```bash
$ adb push /home/user/Documents/project/xxx/app/build/outputs/apk/app-server_local-debug.apk /data/local/tmp/com.xxx.yyy
$ adb shell pm install -r "/data/local/tmp/com.xxx.yyy
```
首先将 apk 包 push 到 /data/local/tmp 目录下，然后使用 pm 安装命令 adb shell pm install -r 安装，便可以安装成功了。

简化版解决方案：
```
$ adb push xxx.apk /data/local/tmp/xxx
$ adb shell pm install -r /data/local/tmp/xxx
```


可以编写python脚本帮助安装`./apkinstall.py ***.apk`

```python
#!/usr/bin/python

import sys
import os
import re

# sys.argv 用于存储传递给 python 脚本的参数
# 脚本名：    sys.argv[0]
# 参数1：     sys.argv[1]
# 参数2：     sys.argv[2]
argslen = len(sys.argv)

# 判断是否指定了要安装的 apk 包路径
if argslen == 1:
    print "Usage: apkinstaller.py [APK_FILE]"
    print "Install apk to your mobile"
    sys.exit(0)

# 获取到 apk 包路径
apk_path = sys.argv[1]

# 判断 apk 文件是否存在
if not os.path.exists(apk_path):
    print apk_path + " : no such apk file"
    sys.exit(0)

# 截取到 apk 文件名
apk_file = re.findall(".*/(.+\.apk)", apk_path)[0]

print
print 'installing ' + apk_file
print

# python 调用 shell 脚本进行安装
os.system('adb push ' + apk_path + ' /data/local/tmp/' + apk_file)
os.system('adb shell pm install -r /data/local/tmp/' + apk_file)
```

[原文地址](http://blog.csdn.net/liangjiu2009/article/details/78411835)