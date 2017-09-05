---
title: 'Python基础学习之[IO编程]'
copyright: true
date: 2017-07-14 14:34:03
categories: Python
tags:
- Python
- Programming language
---
# IO编程
Input Stream: 数据从外面（磁盘、网络）流进内存
Output Stream：数据从内存流出外面
外设CPU与内存速度不匹配的问题：
- 同步IO：程序与数据写入按线性运行，一方必须等待另一方做完
- 异步IO：程序（CPU执行）与数据写入按并行运行。

两者的最大区别是是否 **等待IO执行的结果**,
异步IO具有相当复杂的编程模型：回调模式、轮询模式等
<!--more-->

## 文件读写
Python 内置读写文件的函数，用法和C兼容。
### 读文件
- read(): 适用于文件小，文件一次性读取比较方便的情况
- read(size): 不确定文件大小，可适用循环调用read(size)
- readlines(): 一行行读，返回一个list，适用于配置文件的读取等

```python
try:
    f = open('D:\\coder\\Python\\6.27\\IOtestfiles.txt','r') #打开一个文件对象使用Open()函数
    print(f.read()) #read()方法可以一次读取文件所有内容

finally:
    if f:
        f.close()


#等价于下列方法，with语句自动调用close()方法,此方法是等价的。
with open('D:\\coder\\Python\\6.27\\IOtestfiles.txt','r') as f:
    print(f.read())
```

### 写文件
调用`open()`函数时，传入标识符`w`或者`wb`表示写文本文件或二进制文件.适用write()函数将要写入的字符串写入文件：

```python
with open('D:\\coder\\Python\\6.27\\IOtestfiles.txt','w') as f:
    f.write('haha,so good, i love python ~')
```

## StringIO 和 BytesIO
在内存中操作String和Bytes

```python
from io import StringIO
f=StringIO()
f.write('hello')
f.write(' ')
f.write('good boy!')
print(f.getvalue())


f2=StringIO('Hello!\nbad！\n Guys!')
while True:
    s=f2.readline()
    if s=='':
        break
    print(s.strip())

from io import BytesIO
f=BytesIO()
f.write('中文啊'.encode('utf-8'))
print(f.getvalue())

f2=BytesIO(b'\xe4\xb8\xad\xe6\x96\x87')
f2.read()
```

## 操作文件和目录

```python
>>>import os
>>> os.path.abspath('.') #获取当前位置的绝对路径
'D:\\coder\\Python\\6.27'
>>> os.path.join('D:\\coder\\Python\\6.27','testdir')#把新目录的完整路劲表示出来
'D:\\coder\\Python\\6.27\\testdir'
>>> os.mkdir('D:\\coder\\Python\\6.27\\testdir') #创建新目录
>>> os.rmdir('D:\\coder\\Python\\6.27\\testdir') #删除该目录

>>> os.path.split('D:\\coder\\Python\\6.27\\IOtestfiles.txt') #拆分路径
('D:\\coder\\Python\\6.27', 'IOtestfiles.txt')
>>> os.path.splitext('D:\\coder\\Python\\6.27\\IOtestfiles.txt') #获得文件扩展名
('D:\\coder\\Python\\6.27\\IOtestfiles', '.txt')
>>> os.rename('IOtestfiles.txt','IOtestfiles.py') #修改当前目录下文件的命名，重命名
>>> os.remove('IOtestfiles.py') #删除文件

```

## 序列化（pickling）
把变量从内存中变成可存储或传输的过程称之为序列化，序列化之后内容可以写入磁盘，或者通过网络传输到另外的机器中。
反过来，把变量内容从序列化的对象读到内存里称为反序列化，即unpickling。
Python中提供了`pickle`模块实现序列化。

```Python
import pickle
d=dict(name='li',age=25,score=100)
with open('dump.txt','wb') as f:
    pickle.dump(d,f) #该函数将d序列化成bytes，然后这个bytes写入文件

with open('dump.txt','rb') as f:
    d=pickle.load(f) #反序列化
print(d)

```

### 序列化成JSON
该序列化更通用，更符合web标准，一般使用该种方法，进行序列化

```python
import json
d=dict(name='li',age=25,score=100)
with open('dump.txt','w') as f:
    json.dump(d,f) #该方法是返回的JSON字符串str，写入file-like-object文件中

with open('dump.txt','r') as f:
    d=json.load(f) #反序列化，将文件中
print(d)

import json
class Student(object):
    def __init__(self, name, age, score):
       self.name=name
       self.age=age
       self.score=score

def student2dict(std): #下面两个是独立于class的转换函数
        return{
        'name': std.name,
        'age': std.age,
        'score': std.score
        }
def dict2student(d):
        return Student(d['name'],d['age'],d['score'])

s=Student('li',20,100)
print(json.dumps(s,default=student2dict))
{"name": "li", "score": 100, "age": 20}

>>> print(json.loads(json_str,object_hook=dict2student))
<__main__.Student object at 0x000000371B3DB0B8>
```
# Reference
[liaoxuefeng的博客](http://www.liaoxuefeng.com/wiki/0014316089557264a6b348958f449949df42a6d3a2e542c000/001431917590955542f9ac5f5c1479faf787ff2b028ab47000)
