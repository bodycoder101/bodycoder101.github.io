---
title: 'Python基础学习之[TCP/UDP编程]'
copyright: true
date: 2017-07-22 14:41:50
categories: Python
tags:
- Python
- Programming language
---

# TCP编程
TCP是建立可靠连接，通信双方可以使用流的形式发送数据。
`Socket`表示 **打开一个网络链接，** 需要目标地址的  **IP地址和端口号，并指定协议类型（TCP or UDP）。**

<!--more-->

## 客户端(Client)

创建一个基于TCP连接的 **Socket：**

```python

import socket #导入socket库
#创建一个socket，AF_INET指定的是IPv4协议，SOCK_STREAM是使用面向流的TCP协议
s=socket.socket(socket.AF_INET,socket.SOCK_STREAM)

#提供web服务的IP或者域名，一般web服务的端口是80端口，里面是一个tuple
s.connect(('www.sina.com.cn', 80))

#发送HTTP请求，使用HTTP协议的格式，\r\n是回车换行
s.send(b'GET / HTTP/1.1\r\nHost: www.sina.com.cn\r\nConnection: close\r\n\r\n')

#接收数据
buffer=[]
while True:
    d=s.recv(1024) #每次最多接收1k字节的数据
    if d:
        buffer.append(d)
    else:
        break
data=b''.join(buffer)

s.close() #关闭连接

#接收到的数据包含http的header和body，将两者分离，使用回车换行符作为分隔符
header, html = data.split(b'\r\n\r\n',1)
print(header.decode('utf-8'))

with open('sina.html','wb') as f:
    f.write(html)

```

## 服务器(Server)
服务器首先需要绑定一个端口（web服务器一般是绑定固定端口80）并监听来自其他客户端的连接，一旦有客户端请求连接，就创建该Socket连接。
一个Socket依赖4项：** 服务器地址、服务器端口、客户端地址、客户端端口。** 这些地址指的是IP地址。
每个新的连接需要一个新的进程或者新的线程来处理。

```python
# TcpServer.py
import socket,threading,time
# 线程处理模块
def tcplink(sock,addr):
    print('Accept new connection from %s:%s...' % addr)
    sock.send(b'Welcome!')
    while True:
        data= sock.recv(1024)
        time.sleep(1)
        if not data or data.decode('utf-8') == 'exit':
            break
        sock.send(('Hello,%s!' %data.decode('utf-8')).encode('utf-8'))
    sock.close()
    print('connection from %s:%s closed.' %addr)


#创建一个基于IPv4和TCP协议的socket
s = socket.socket(socket.AF_INET,socket.SOCK_STREAM)

#绑定监听的地址和端口，127.0.0.1表示的是本机地址，小于1024的端口号必须要有管理员权限才能够绑定
s.bind(('127.0.0.1',9999)) #注意传进去的是一个tuple

#监听端口,传入的参数表示的是指定等待连接的最大数量
s.listen(5)
print('Waiting for connection...')

#接受来自客户端的连接，accept()等待返回一个客户端的连接
while True:
    sock, addr = s.accept() #接收一个新连接
    t = threading.Thread(target=tcplink, args=(sock,addr)) #创建新线程来处理TCP连接
    t.start()


# 测试所用客户端程序
# TcpClient.py
import socket
s= socket.socket(socket.AF_INET,socket.SOCK_STREAM)
s.connect(('127.0.0.1',9999)) #建立连接,注意传进去的是一个tuple

print(s.recv(1024).decode('utf-8')) #接收欢迎信息，welcome！
for data in [b'Li','Cheng','victor']: #发送数据
    s.send(data)
    print(s.recv(1024).decode('utf-8'))
s.send(b'exit') #退出连接
s.close()

结果如下：
Server side：
[root@localhost Python]# python TcpServer.py
Waiting for connection...
Accept new connection from 127.0.0.1:55828...
connection from 127.0.0.1:55828 closed.

Client side：
[root@localhost Python]# python TcpClient.py
Welcome!
Hello,Li!
Hello,Cheng!
Hello,victor!

```

# UDP编程
UDP是面向无连接的协议，使用UDP协议，不需要建立连接，只需要知道对方的IP地址和端口号，就可以直接发送数据包。UDP传输数据是不可靠的，但速度快，，比如有些视频数据可以使用UDP传送。

** 服务器绑定UDP端口和TCP端口互不冲突，端口号9999既可以与UDP绑定又可以与TCP绑定。 **

```python
# UDPServer.py

import socket

# SOCK_DGRAM指定了socket的类型是UDP，绑定端口和地址
s=socket.socket(socket.AF_INET,socket.SOCK_DGRAM)

s.bind(('127.0.0.1',9999))
print('Bind UDP on 9999...')
while True:
     # recvfrom函数返回数据和客户端的地址（包含IP和端口号），与TCP不同的是，tcp使用accept函数（返回socket对象和地址addr）
	data, addr=s.recvfrom(1024)
	print('Receive from %s:%s.' %addr)
	s.sendto(b'hello %s!' %data,addr) #调用sendto函数将数据用UDP发送回客户端

# UDPClent.py
import socket
s=socket.socket(socket.AF_INET,socket.SOCK_DGRAM)
for data in [b'Li', b'Cheng', b'victor']: #发送数据
    s.sendto(data,('127.0.0.1',9999)) # 通过sendto函数将数据发送给服务器
    print(s.recv(1024).decode('utf-8')) #打印出从服务器返回的信息，从服务器接收数据仍然调用recv()方法。
s.close()

结果是：
Server side：
[root@localhost Python]# python UDPServer.py
Bind UDP on 9999...
Receive from 127.0.0.1:60359.
Receive from 127.0.0.1:60359.
Receive from 127.0.0.1:60359.

Client side：
[root@localhost Python]# python UDPClient.py
hello Li!
hello Cheng!
hello victor!

```
# Reference
[liaoxuefeng的博客](https://www.liaoxuefeng.com/wiki/0014316089557264a6b348958f449949df42a6d3a2e542c000/001432004374523e495f640612f4b08975398796939ec3c000#0)
