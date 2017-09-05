---
title: 'Python基础学习之[高级特性]'
copyright: true
date: 2017-07-08 20:12:10
categories: Python
tags:
- Python
- Programming language
---
# 高级特性
在Python中，代码越少越好，越简单越好，对于高级语言来说，代码行数越少，开发效率执行效率越高。

## 切片（slice）
对于list，可以使用 L[0:3] 表示 从索引0开始，直到索引3，不包含3，即L[0],L[1],L[3],如果第一个索引为0，可以忽略，即可以写成L[:3]. **倒数第一个的序号为-1**.
类似与matlab中的语法，可以直接使用范围的下标。
L[0:10:2] //这个和matlab有区别，这个步长是2，范围是0到10（不包含10），中间的是尾部
tuple也是类似的情况，tuple可以是字符串，是不可变的，然后可以使用切片，截取字符串。
<!--more-->

## 迭代（iteration）
对于dic中的数据，可以使用下列方式进行迭代：

```python
d={'a':1, 'b':2, 'c':3}
>>for key in d: #只迭代key出来
    print(key)

for value in d.values(): #迭代values出来
    print(value)

for k,v in d.items(): #迭代key和values出来
    print(k,v)

 for i,value in enumerate(['A','B','C']): #对list实现下标循环
    print(i,value)
```

## 列表生成式（List Comprehensions）

```python
[1x1, 2x2, 3x3, ..., 10x10]
>>>L=[]  #方法一
>>>for x in range(1,11):
    L.append(x*x)

>>>[x*x for x in range(1,11)] #方法二，直接使用列表生成器

>>>[x*x for x in range(1,11) if x%2==0] #也可以在for后面添加各种判断条件

```

## 生成器（generator）
python中一边循环一边计算的机制，称为生成器：generator。
在循环过程中不断推出后续的元素，可以不必创建完整的list，节省大量的空间。生成器中的元素应该使用for循环打印出来。
list中，可以将列表生成式中的 [] 改成（），相应的就创建了generator。

```python
>>> g = (x * x for x in range(10))
>>> g
<generator object <genexpr> at 0x1022ef630>

如果有递推关系的函数，也可以使用生成器的概念

def fib(maxd):
    n,a,b=0,0,1
    while n<maxd:
        yield b #作用是替代 print b。
        a,b=b,a+b
        n=n+1
    return 'done'

>>> f =fib(6)
>>> f
<generator object fib at 0x000000181D458AF0>

for n in f: #使用for循环打印出来
...     print(n)

想要获得return 'done'的返回值，必须捕获StopIneration错误，返回值在StopIteration的value中

g= fib(6)
while True:
    try:
        x=next(g)
        print(x)
    except StopIteration as e:
        print(e.value)
        break

```
generator来说，遇到return语句或者执行到函数体最后一行语句，就是结束generator的指令，for循环随之结束。

## 迭代器（iterator)

可以被next()函数调用并不断返回下一个值的对象称为迭代器：Iterator。

可以使用isinstance()判断一个对象是否是Iterator对象。

## 小结

- 凡是可作用于for循环的对象都是Iterable类型；

- 凡是可作用于next()函数的对象都是Iterator类型，它们表示一个惰性计算的序列；

集合数据类型如list、dict、str等是Iterable但不是Iterator，不过可以通过iter()函数获得一个Iterator对象。

# Reference
[liaoxuefeng的博客](http://www.liaoxuefeng.com/wiki/0014316089557264a6b348958f449949df42a6d3a2e542c000/0014317568446245b3e1c8837414168bcd2d485e553779e000)
