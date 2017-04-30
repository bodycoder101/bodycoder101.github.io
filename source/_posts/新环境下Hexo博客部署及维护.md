---
title: 新环境下Hexo博客部署及维护
date: 2017-02-20
categories: hexo
tags: [git,hexo]
---
   之前的博客源码一直放在Linux（CentOS）环境下，最近想要更新博客，发现在Linux环境下编辑Markdown文件各种不方便；在Windows环境写好后再传到Linux环境下再部署总觉得多此一举，遂想要将博客迁移出来，期间遇到了各种问题，还好都解决了。将出现的问题及解决方法总结记录下来，以后或许还能用上。
   <!-- more -->
## 准备工作
之前博主已经将博客源码推送至github中，和多数人一样，是一个仓库做两个分支：

 - master分支：存放博客部署的静态文件(也就是public文件夹下的内容)
 - hexo分支：存放博客源文件，配置文件等

在新环境(Windows)下安装配置*Git，Node.js，Python*;Python建议下载2.7版本，安装好后别忘了配置环境变量。
提供下载链接：

- [Git](https://github.com/waylau/git-for-win)
- [Node.js](https://nodejs.org/en/download/)
- [Python](https://www.python.org/downloads/)


## 新环境部署
首先在我们新环境下为我们的博客新建一个目录blog。在该目录下右键执行**Git Bash Here,**然后克隆你的远程仓库，也就是hexo分支上的内容；
` git clone https://github.com/bodycoder101/bodycoder101.github.io.git newBlog`
### 问题一
出现clone失败报错（Filename too long）：
```
GitHub.IO.ProcessException: fatal: unable to stat 'plugins/toolongname/example/app/platforms/toolongname/toolongname/build/intermediates/classes/debug/org/toolongname/toolongname/toolongname$toolongname$toolongname.class': Filename too long
```
后面各种找解决方法，终于找到一个靠谱的方案: [Solution](http://ourcodeworld.com/articles/read/109/how-to-solve-filename-too-long-error-in-git-powershell-and-github-application-for-windows)，原因也解释的很清楚；
在Bash中键入命令:`git config --system core.longpaths true `; 问题解决。
### 问题二
进入博客根目录：` cd newBlog`；然后依次键入下列命令**[1]**：
```
npm install -g hexo-cli
npm install
npm install hexo -server --save
npm install hexo-deployer-git --save
```
出现各种问题，无法安装*hexo*:
```
npm ERR! System Windows_NT 6.1.7601
npm ERR! command "c:\\Program Files\\nodejs\\node.exe" "c:\\Program Files\\nodej
s\\node_modules\\npm\\bin\\npm-cli.js" "install"
npm ERR! cwd f:\Workspace\Angular_workspace\angular-phonecat
npm ERR! node -v v0.10.28
npm ERR! npm -v 1.4.9
npm ERR! path C:\Users\Shivam\AppData\Roaming\npm-cache\inherits\2.0.1\package
npm ERR! code EPERM
npm ERR! errno 50
npm ERR! stack Error: EPERM, unlink 'C:\Users\Shivam\AppData\Roaming\npm-cache\i
nherits\2.0.1\package'
npm http 200 https://registry.npmjs.org/qs
```
找到解决方案，依次键入下列命令：
```
npm config get registry
npm cache clean
npm install express
```
问题完美的解决，然后重新执行[1]处命令，就在博主认为可以愉快的写博客的时候，问题又出现了；
### 问题三
执行` hexo clean`,出现下列问题：
![](https://raw.githubusercontent.com/bodycoder101/MarkdownPhotos/master/hexo_clean_error.png)
根据提示键入命令安装：
`npm rebuild node-sass`
安装过程出现各种` npm error，gyp error`，在查找问题过程中，出错信息提示：
![](https://raw.githubusercontent.com/bodycoder101/MarkdownPhotos/master/could_not_find_python.png)

那就新环境下安装**Python！**，忘安装了..
至此，问题全部解决，可以愉快的写博客了！

## 参考博客
1.[Hexo博客多电脑同步及更换电脑后处理方式](http://www.lzblog.cn/2016/11/21/Hexo%E5%8D%9A%E5%AE%A2%E5%A4%9A%E7%94%B5%E8%84%91%E5%90%8C%E6%AD%A5%E5%8F%8A%E6%9B%B4%E6%8D%A2%E7%94%B5%E8%84%91%E5%90%8E%E5%A4%84%E7%90%86%E6%96%B9%E5%BC%8F/)
2.[在不同的电脑维护Hexo和写作](http://www.rvclient.com/2016/05/21/hexo-everywhere/)
