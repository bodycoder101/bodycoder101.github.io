---
title: 'Network Protocol总结[1]--HTTP协议'
copyright: true
date: 2017-06-29 21:32:50
categories: Computer Network
tags:
- HTTP
- Network Protocol
---

# 概念回顾之网络模型（Model）

如下图，左边是OSI参考模型对应的七层结构，中间是TCP/IP参考模型的五层结构，实际中应用广泛的是TCP/IP参考模型，讨论的范围限定于TCP/IP模型。网络中各层次的协议组成了 **TCP/IP协议簇（Internet Protocol Suite）**，右边是各个层次的典型的协议，接下来的几个总结讲挑选各个层次典型的一些协议。
<!-- more -->

![](https://raw.githubusercontent.com/bodycoder101/MarkdownPhotos/master/TCP_IP%E6%A8%A1%E5%9E%8B.jpg)

## 网络接口层
包含OSI参考模型中的数据链路层和物理层，**数据链路层(Data Link Layer)又分为逻辑链路控制子层(Logical Link Control --LLC)和媒体接入控制子层(Media Access Control--MAC).**

LLC子层主要负责向其上层提供服务，是在HDLC的基础上发展起来的; MAC子层的主要功能包括数据帧的封装/卸装，帧的寻址和识别，帧的接收与发送，链路的管理，帧的差错控制等, 其非常重要的一项功能是 **仲裁传输介质的使用权**，即规定站点何时可以使用通信介质，局域网中通常使用的载波侦听多路访问（Carrier Sense Multiple Access /Collision Detection，CSMA/CD）.

物理层定义与传输媒体的接口有关的一些特性,即机械特性、电气特性、功能特性、过程特性,并需要完成并行传输和串行传输之间的转换。数据链路层向该层用户提供透明的和可靠的数据传输服务。 透明性是指该层上传输的数据的内容、格式及编码没有限制,也没有必要解释信息结构的意义；可靠性是指在传输过程中将物理层提供的可能出错的物理连接改造成为逻辑上无差错的数据链路,其具体的方法有帧同步、差错控制、流量控制、链路管理。数据链路层中的主要协议有 **点对点协议PPP,CSMA/CD协议,以太网802.3。**


## 网际层(IP层)
网际层向上只提供简单灵活的、无连接的、尽最大努力交付的数据报服务。网际层不提供服务质量的承诺,即所传输的分组可能出错、丢失、重复和失序,当然也不保证分组交付的时限。

网际层中主要协议有IP协议,地址解析协议ARP和网际控制报文协议ICMP等。
- IP协议是网际层的核心,通过路由选择将下一跳IP封装后交给网络接口层。IP 数据报是无连接服务。
- ICMP是网际层的补充,可以回送报文。用来检测网络是否通畅(使用ping命令)。
- ARP是通过已知IP,寻找对于主机的MAC地址。

## 运输层
运输层为应用进程之间提供端到端(host- to-host)的逻辑通信,并具有复用和分用的功能,即发送方不同的应用进程都可以使用同一个运输层协议传送数据；接收方的运输层在剥去报文的首部后能够把这些数据正确交付到目的应用进程。运输层还将对报文进行差错控制,以提供可靠传输。运输层中主要协议有用户数据报协议UDP和传输控制协议TCP。   

## 应用层
应用层为用户提供应用程序。
应用层中主要协议有域名系统DNS,文件传输协议FTP,远程终端协议TELNET,超文本传输协议HTTP,简单邮件传送协议SMTP,邮件读取协议POP3和IMAP,动态主机配置协议DHCP等。
- DNS：提供域名解析服务,提供域名到IP地址之间的转换,使用端口53
- HTTP：用于实现万维网上的各种链接,即万维网客户程序与万维网服务器之间的连接,使用端口80

# 概念回顾之数据封装（Data Encapsulation）

 ![](https://raw.githubusercontent.com/bodycoder101/MarkdownPhotos/master/data%20encapsulation.jpg)

从上到下是进行数据的加封装，反之是解封装，在网络中传输会经过解封装和加封装的过程，如路由器是网络层设备，需要解封装得到IP地址然后向目的网络转发，需再加封装。
1.	应用层: 主机产生需要传输的数据，统一称为 **Message或者PDU（Protocol Data Unit）;**
2.	传输层:  加上TCP或者UDP的报头，封装成 **数据段(Segment);**
3.	网络层: 加上IP的报头，封装成 **数据包(IP Datagram/Packet);**
4.	数据链路层: 加上LLC和MAC的报头，由数据域(Data)通过CRC等方法生成FCS加到数据包尾部，封装成 **数据帧(Frame)**, 最后在物理介质以 **比特流(Bits)** 的形式进行传输。

# 应用层协议之HTTP协议
HTTP协议是 **Hyper Text Transfer Protocol（超文本传输协议）** 的缩写,是用于从Web服务器传输超文本到本地浏览器的传送协议。
HTTP是一个基于TCP/IP通信协议来传递数据（HTML 文件, 图片文件, 查询结果等）; HTTP协议工作于客户端-服务端架构为上。浏览器作为HTTP客户端通过URL向HTTP服务端即WEB服务器发送所有请求。Web服务器根据接收到的请求后，向客户端发送响应信息。
典型的HTTP请求响应过程(Request-Response)如图所示：

 ![](https://raw.githubusercontent.com/bodycoder101/MarkdownPhotos/master/HTTP_Steps.png)


## HTTP 请求方法 (request methods)


**HTTP1.0** 定义了三种请求方法： GET, POST 和 HEAD方法;

**HTTP1.1** 新增了五种请求方法：OPTIONS, PUT, DELETE, TRACE 和 CONNECT 方法。

```
GET      请求指定的页面信息，并返回实体主体。

HEAD     类似于get请求，只不过返回的响应中没有具体的内容，用于获取报头

POST     向指定资源提交数据进行处理请求（例如提交表单或者上传文件）,数据被包含在       
         请求体中。POST请求可能会导致新的资源的建立和/或已有资源的修改。

PUT      从客户端向服务器传送的数据取代指定的文档的内容。

DELETE   请求服务器删除指定的页面。

CONNECT  HTTP/1.1协议中预留给能够将连接改为管道方式的代理服务器。

OPTIONS  允许客户端查看服务器的性能。

TRACE    回显服务器收到的请求，主要用于测试或诊断
```
## HTTP响应状态码 (response status codes)

状态代码有 **三位数字** 组成，第一个数字定义了 **响应的类别** ，共分五种类别:

```
Information  1xx：指示信息--表示请求已接收，继续处理

Success      2xx：成功--表示请求已被成功接收、理解、接受

Redirection  3xx：重定向--要完成请求必须进行更进一步的操作

Client Error 4xx：客户端错误--请求有语法错误或请求无法实现

Server Error 5xx：服务器端错误--服务器未能实现合法的请求

```

**常见状态码：**

```
100 Continue                  // 服务器仅接收到部分请求，但一旦服务器未拒绝该请求，客户端应该继续发送其余的请求
200 OK                        //客户端请求成功
301 Moved Permanently         //所请求的页面转移至新的URI，重定向
400 Bad Request               //客户端请求有语法错误，不能被服务器所理解
401 Unauthorized              //请求未经授权，这个状态代码必须和WWW-Authenticate报头域一起使用
403 Forbidden                 //服务器收到请求，但是拒绝提供服务
404 Not Found                 //请求资源不存在，eg：输入了错误的URL
500 Internal Server Error     //服务器发生不可预期的错误
501 Not Implemented           //请求未完成，服务器不支持所请求的功能
503 Server Unavailable        //服务器当前不能处理客户端的请求，一段时间后能恢复正常
```
更多的状态码参考:
[RFC 7231](https://tools.ietf.org/html/rfc7231)


# 参考
- [ranyonsue的博客](http://www.cnblogs.com/ranyonsue/p/5984001.html)
- [翡青的博客](http://blog.csdn.net/zjf280441589/article/details/44900353)
- [百度百科](http://baike.baidu.com/link?url=2-ysP8g7KesdPy_V2gMbJcrzqG21Fqthumzu8ObCUCbHPnEvpTByySPC9wKdh0Man7k4OOFm8xuA9ekggxDg4kKL8LvQhnkwYAS494wA342KvthGWUJFOAjcJ0mn_8in9I2UbJHllO6w5YRQtvLyqa)
- [RFC7231](https://tools.ietf.org/html/rfc7231)
- [Dartagnan的博客](http://blog.csdn.net/dadoneo/article/details/8315833)
