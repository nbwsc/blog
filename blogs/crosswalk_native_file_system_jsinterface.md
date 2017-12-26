# crosswalk 本地文件系统javascript api

`android` `crosswalk/xwalk` `file_system` `javascript`

## 精简版 

talk is cheap ,show me the [code](https://github.com/nbwsc/blog/blob/master/blogs/xwalk_file.js)

## 故事版

由于一些历史原因,要使所有用户进行应用升级，但是没有内置升级系统，整个过程非常复杂，不写下来对不起自己。。

### 需求：
1. 升级app（android application ，使用嵌入式crosswalk，加上webonline。）
2. 用户尽量少操作
3. 保留用户原有信息（crosswalk的localStorage中）

### 分析

其实还有几条路可以走本来，比如重定向，也能解决当前问题，但是后来发现应用逻辑限制，本身不支持重定向。
那么只能升级app，升级app有几个步骤，一个是下载，一个是打开apk（最好能静默安装，但是应用没有root或系统应用权限）。现在能改动的只有crosswalk中执行的javascript。

有几种办法可以使用js借助浏览器下载：

1. 带download属性的a标签
2. iframe下载
3. http请求带上返回附件头

三种都可以下载，但是在实际环境测试中，用户使用的安卓盒子有一种阉割比较厉害的rom，我们先管它叫xlrom，从`adb logcat`中看到浏览器一下载系统就会杀掉这个进程，所以js下载在这种盒子上不行，这就意味着无法下载apk。

所以这个路走不通了。后来决定发通知，让用户从应用市场下载，虽然会有一些操作性，但是可能是唯一的办法了。

那就暂时不考虑升级app的问题了。同时，既然要升级应用，那么浏览器和域名都改了，如何共享当前域名下的用户信息呢。由两种方案
1. 写入本地共享文件
2. 将用户信息和设备信息（不是浏览器信息）关联

方案1的话正常情况下是可以的，就是使用下载的方式，下载一个js生成内容的文件。可以这么弄：

```html
<a id="save" download="earth.txt" href="data:text/plain,mostly harmless&#10;" style="display:none"></a>
<script>
    function saveFile(contents, file_name, mime_type) {
    var a = document.getElementById('save');
    mime_type = mime_type || 'application/octet-stream'; // text/html, image/png, et c
    if (file_name) a.setAttribute('download', file_name);
    a.href = 'data:'+ mime_type +';base64,'+ btoa(contents || '');
    a.click();
    }
</script>

```
但是上面提到了某种盒子下是不能下载的。所以这个方案也不行。而原应用并没有提供任何原生读写的能力（我原以为没有，其实crosswalk封装了），似乎也走不通了。

方案2的话，我翻阅了很多信息，没有找到js能够拿到uuid或者设备指纹之类的，`client.js`封装的浏览器指纹在crosswalk中也拿不到，而且浏览器指纹也没有用。
我甚至尝试从网络请求中获取信息，客户端的ip是能拿到，但是ip不稳定，经常变，所以不能作为客户端的票据，而且我们的用户有一个路由器下数个设备的情况。客户端的mac地址我也尝试拿过，但是不行，因为mac地址在http请求中只能维持一跳，一旦跳出路由器mac地址就变了，服务器只能拿到最后一跳的mac地址，所以也失败了。我甚至看了裸tcp能不能做这个事情，结果也都失败了。

在最后几乎绝望的情况下，我想这个crosswalk有没有预留什么特殊的接口呢，于是正文开始了；

我直接开着adb crosswalk的调试，在console里`console.dir(window`查看里面所有变量，发现有一个xwalk的全局变量.里面有一个`experimental`,然后里面有个`native_file_system`. 一惊,这不是我想要的么.`native_file_system`里有几个`_proto_`:`constructor`,`getRealPath`,`requestNativeFileSystem`.用了那么久的crosswalk竟然不知道crosswalk竟然自己封装了文件系统.那接下来就找找这个的api doc了.

爆栈上找了一边 没有提这个的,github的issue和wiki上也没有详细用法说明.于是我就把源码clone下来分析.

`grep`找`native_file_system`,找到一个html测试文件,开星!

```javascript
 <script>
      var current_test = 0;
      var test_list = [
        getRealPath,
        writeFile,
        readFile,
        removeFile,
        createDirectory,
        readDirectoryEntries,
        removeDirectory,
        endTest
      ];

      function runNextTest() {
        if (current_test < test_list.length) {
          test_list[current_test++]();
        }
      };

      function reportFail(error) {
        console.log(error);
        document.title = "Fail";
        document.body.innerText = "Fail";
      };

      function endTest() {
        document.title = "Pass";
        document.body.innerText = "Pass";
      };

      function getRealPath() {
        var doesNotExist =
            xwalk.experimental.native_file_system.getRealPath("invalid!");
        if (doesNotExist !== "")
          reportFail("getRealPath should have failed.");
        else
          runNextTest();

        // Implementing a check for a valid path, which depends on the OS and
        // user locale, is left as an exercise to the reader.
      }

      function writeFile() {
        xwalk.experimental.native_file_system.requestNativeFileSystem("documents",
          function(fs) {
            fs.root.getFile("/documents/1.txt", {create: true}, function (entry) {
              entry.createWriter(function (writer) {
                var blob = new Blob(["1234567890"], {type: "text/plain"});
                writer.write(blob);
                runNextTest();
              },
              function(e) {reportFail(e)});
            },
          function(e) {reportFail(e)});
        });
      }

      function readFile() {
        xwalk.experimental.native_file_system.requestNativeFileSystem("documents",
          function(fs) {
            fs.root.getFile("/documents/1.txt", {create: false}, function (entry) {
                entry.file(function(file) {
                  reader = new FileReader();
                  reader.onloadend = function(e) {
                    if ("1234567890" == this.result) {
                      runNextTest();
                    } else {
                      reportFail();
                    }
                  };
                  reader.readAsText(file);
                },
                function(e) {reportFail(e)});
            },
            function(e) {reportFail(e)});
        },
        function(e) {reportFail(e)});
      };


      function removeFile() {
        xwalk.experimental.native_file_system.requestNativeFileSystem("documents",
            function(fs) {
              fs.root.getFile("/documents/1.txt", {create: false}, function (entry) {
                entry.remove(function () {
                      runNextTest();
                    },
                    function(e) {reportFail(e)});
              },
              function(e) {reportFail(e)});
            }
        );
      }

      function createDirectory() {
        xwalk.experimental.native_file_system.requestNativeFileSystem("documents",
            function(fs) {
              fs.root.getDirectory("/documents/justfortest", {create: true}, function (entry) {
                runNextTest();
              },
              function(e) {reportFail(e)});
            }
        );
      }

      function readDirectoryEntries() {
        xwalk.experimental.native_file_system.requestNativeFileSystem("documents",
            function(fs) {
              fs.root.getDirectory("/documents/", {create: false}, function (entry) {
                var dirReader = entry.createReader();
                var entries = [];
                dirReader.readEntries(function(results) {
                    if (0 < results.length) {
                      runNextTest();
                    } else {
                      reportFail("You app home directory is empty!");
                    }
                  },
                  function(e) {reportFail(e)}
                );
                runNextTest();
              },
              function(e) {reportFail(e)});
            }
        );
      }

      function removeDirectory() {
        xwalk.experimental.native_file_system.requestNativeFileSystem("documents",
            function(fs) {
              fs.root.getDirectory("/documents/justfortest", {create: false}, function (entry) {
                entry.remove(function () {runNextTest();},
                    function(e) {reportFail(e)});
              },
              function(e) {reportFail(e)});
            }
        );
      }

      runNextTest();
    </script>

```

直接把源码全贴出来,欣喜得拿出来在chrome debug里调试一下,结果跑不同,仔细一排查发现这个`documents`virtualPath在安卓里不存在.

那怎莫办,再找找看,于是找到了第二个测试html,在`test/android/data/`下,内容类似但是virtualPath不同,是`cachedir`.

`cache`分两部分,不知道这个`cachedir`指的是公共cache还是internal cache只能测试说话了.

要测的是两个部分 1. 离线/重启保存；2. 不同包名应用共享

结果发现既然是本地文件系统,1肯定是没问题,2确是私有的cache; 顿时心灰意冷,尝试了几个常用的vitrualpath,比如`download`,`sdcatd`,`/`也不成功.

在要放弃之际,我觉得这个vitrualpath肯定定义在源码里,于是开始及找,终于找到一个java文件,里面定义了android的vitrualPath
```java
          String names[] = {
            "ALARMS",
            "DCIM",
            "DOWNLOADS",
            "MOVIES",
            "MUSIC",
            "NOTIFICATIONS",
            "PICTURES",
            "PODCASTS",
            "RINGTONES"        
            };
```
好了 随便选一个吧,都是在`sdcard`下的路径,注意有些阉割版安卓会没有其中某一个或几个,使用前请测试.

另外一个,就是我发现他写入的封装是很底层的`blob`的方式,就是假如你要覆盖一个文件,你得先把它写成空,或者删了,再写入.否则,举个例子,
如果你向写了`1234567890`的文件写入`321`,那么这个文件就变成`3214567890`了.要稍加注意.

贴上[代码链接](https://github.com/nbwsc/blog/blob/master/blogs/xwalk_file.js),可以直接用