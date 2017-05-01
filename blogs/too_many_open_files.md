# 一个由too many open files引发的一系列问题及解决

`tornado` `websocket` `too many open file` 

上周遇到一个问题，推送服务器cpu异常，无法正常推送，查看日志发现是websocket链接到了上限， tornado报too many open files的错误，但是cpu，mem和带宽都没有问题（cpu异常是因为在不停的打log）。所以应该是进程句柄不够用的情况，stackoverflow上有一个[回答](http://stackoverflow.com/questions/20894133/tornado-errno-24-too-many-open-files)是这样

    Many linux distributions ship with very low limits (e.g. 250) for the number of open files per process. You can use "ulimit -n" to see the current value on your system (be sure to issue this command in the same environment that your tornado server runs as). To raise the limit you can use the ulimit command or modify /etc/security/limits.conf (try setting it to 50000).

    Tornado's HTTP server does not (as of version 3.2) close connections that a web browser has left open, so idle connections may accumulate over time. This is one reason why it is recommended to use a proxy like nginx or haproxy in front of a Tornado server; these servers are more hardened against this and other potential DoS issues.

他说了两个方面，一个是系统的umilit里限制的单个进程文件打开数限制，我看了一下服务器的`ulimit -n`配置，已经设置成65535了，应该没有这个问题，我想是不是tornado的限制呢， 于是我把客户端直接连python端口改成了通过nginx做的反向代理。结果第一个坑出现了。

业务逻辑中需要用户的ip来进行登录状态的判断，通过nginx的代理过来的连接ip全变成了本地，然后就想办法怎么配nginx的ip透传过来。方法就是在代理头里面加入realip信息，好的，问题解决了？好像没那么简单。使用ngnix代理后tornado会对部分连接请求报错，具体原因没有深究，应该也是要从ngnix配置中做修改，但是在线用户的压力让我还是决定放弃使用ngnix，直面前面句柄耗尽的问题。

然后找到有人说在ternado HTTPserver实例化时添加`no_keep_alive=Ture`。测试不成功。

找来找去，网上的回答无非就是

1. ulimit -n的限制
2. sysctl 中`net.core.somaxconn`，`file-max`的限制，
3. `/etc/security/limits.conf`的限制

ulimit的配置涉及到软硬，还有暂时和永久两种配置方法。
sysctrl的配置是写在/etc/sysctl.conf后面。


但是服务器现在的配置已经是一个比较大的数了。
然后就怀疑是这个配置

说一下测试情况，在本地环境下也能100%复现，现象就是在websocket连接数在1012-1013的时候就会报出这个错误，这个值非常固定，所以判断肯定是一个配置的问题。这不禁让我想到ulimit中open_file的默认值是1024 ,除去进程监控、数据库等连接，差不多也就是1010出头的样子。
所以估计是ulimit的配置没有生效。

沿着这个思路去找了一下，发现有这样的描述

    要使 limits.conf 文件配置生效，必须要确保 pam_limits.so 文件被加入到启动文件中。查看 /etc/pam.d/login 文件中有：session required pam_limits.so

    limits.conf文件实际是Linux PAM（插入式认证模块，Pluggable Authentication Modules）中 pam_limits.so 的配置文件，突破系统的默认限制，对系统访问资源有一定保护作用。 limits.conf 和sysctl.conf区别在于limits.conf是针对用户，而sysctl.conf是针对整个系统参数配置。

    工作原理
    limits.conf是 pam_limits.so的 配置文件，然后/etc/pam.d/下的应用程序调用pam_*.so模块。譬如说，当用户 访问服务器，服务程序将请求发送到PAM模块，PAM模块根据服务名称在/etc/pam.d目 录下选择一个对应的服务文件，然后根据服务文件的内容选择具体的PAM模块进行处理

然后尝试在lib中搜索pam_limits.so,然后全局搜索这个文件，发现在`/lib/x86_64-linux-gnu/security/pam_limits.so`
然后将路径改成绝对路径，重启。测试能连接1500个用户没问题。问题算是解决了。

后来另一个同学提供了另外一个新思路，就是守护进程`supervisor`对进程文件数做了限制，修改supervisor的配置也可以生效，但是我对这个结论有点表示疑惑，因为在本地测试当中我并没有用守护进程也同样由这个限制。



最后，说一下感触，这个问题从发现到几次不同的尝试，花了将近一周的时间解决，每天晚上得登半夜用户下线后才能重启服务，经常搞到2点多。一直做开发，也没怎么做过服务器优化的事情。上一次是因为带宽异常，然后将一些外围服务的架构重新设计了，做了一些缓存来减少访问，还没涉及运维上的优化，这回的优化让我觉得，传说中的DevOps还是挺难的。不过我还是挺喜欢找问题解决问题的那种感觉的。

几个比较有用的命令

```
> netstat -n | awk '/^tcp/ {++S[$NF]} END {for(a in S) print a, S[a]}

> cat /proc/${PID}/limits
#这个命令可以查看该进程正在生效的limits

> lsof -n|awk '{print $2}'|sort|uniq -c |sort -nr|more 
```