# Mac下鼠标中键复制粘贴解决方案

## [macpaste](https://github.com/rsmz/macpaste)

### usage

```
git clone ...
cd ...
make macpaste
./macpaste & 
#you can also link or copy the binary to the PATH path.
```


### issue
在mac terminal下似乎会被粘贴两次
linux下在窗口上边栏按下中键会切换窗口，但是使用这个的话如果这时候有输入光标是激活状态就会往里头粘贴（其实不管你在哪里点中键），这点有点不太好。

### 其他
能配合synergy与linux共享剪切板，这点对与我这种linux/Mac两台设备办公的人来说挺方便的。