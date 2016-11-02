# GitServer搭建

`git` `env`

### 登陆服务器新建git账户
```
login with root @server
sudo apt-get install git
sudo adduser git
```
### 然后创建证书登录：

收集所有需要登录的用户的公钥，就是他们自己的id_rsa.pub文件，把所有公钥导入到`/home/git/.ssh/authorized_keys`文件里，一行一个。

ssh-keygen
cat ~/.shh/id_rsa.pub >> git@server:.ssh/authorized_keys


### 然后初始化仓库

sudo git init --bare sample.git
sudo chown -R git:git sample.git


***一定要bare 不然不允许push，会报
```
remote: error: refusing to update checked out branch: refs/heads/master

git config --bool core.bare true

```


***git push remote: error: insufficient permission for adding an object to repository database ./objects
```
cd .git/objects
ls -al
sudo chown -R yourname:yourgroup *
```


### 最后禁用shell登录：

出于安全考虑，第二步创建的git用户不允许登录shell，这可以通过编辑/etc/passwd文件完成。找到类似下面的一行：

`git:x:1001:1001:,,,:/home/git:/bin/bash`
改为：
`git:x:1001:1001:,,,:/home/git:/usr/bin/git-shell`


### 管理公钥

如果团队很小，把每个人的公钥收集起来放到服务器的/home/git/.ssh/authorized_keys文件里就是可行的。如果团队有几百号人，就没法这么玩了，这时，可以用Gitosis来管理公钥。





参考：

* http://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000/00137583770360579bc4b458f044ce7afed3df579123eca000