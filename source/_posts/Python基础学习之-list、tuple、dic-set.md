---
title: 'Python基础学习之[list、tuple、dic & set]'
copyright: true
date: 2017-07-07 23:16:04
categories: Python
tags:
- Python
- Programming language
---

**list和tuple是Python内置的有序集合，一个可变，一个不可变**
# list
python 内置的数据类型列表：**list**
例如：classmates = ['Michael','Bob','Tracy']
使用 **[ ]** 表示的是list，是一个可变的有序表，可用append方法在末尾添加元素，也可以使用insert方法在指定位置添加，相应位置后的元素往后移，使用pop方法删除末尾或者指定索引位置的元素。
<!--more-->

# tuple
有序表元组：tuple
tuple一旦初始化后就不能够修改，使用 **（）** 表示的是tuple
例如：classmates = ('Michael','Bob','Tracy')
定义空tuple：t=();
定义只有一个元素的tuple：t=(1,)
 **必须加一个逗号，消除歧义，否则会将括号认为是数学公式中的小括号，计算结果是1**

# list & tuple 混合使用
  t = ('a', 'b', ['A', 'B'])
  tuple中含有list，则我们可以有操作：
t[2][0] = 'X'
t[2][1] = 'Y'
t=('a', 'b', ['X', 'Y'])

# dict
Python内置了字典：dict的支持，dict全称dictionary，在其他语言中也称为map，使用键-值（key-value）存储
key是唯一的，key只能对应一个value

和list比较，dict有以下几个特点：

1. 查找和插入的速度极快，不会随着key的增加而变慢；
2. 需要占用大量的内存，内存浪费多。
而list相反：

1. 查找和插入的时间随着元素的增加而增加；
2. 占用空间小，浪费内存很少。
所以，dict是用空间来换取时间的一种方法。
**dict的key必须是不可变对象**

# set
set和dict类似，也是一组key的集合，但不存储value。由于key不能重复，所以，在set中，没有重复的key。
set可以看成数学意义上的无序和无重复元素的集合，因此，两个set可以做数学意义上的交集、并集等操作
**str是不变对象，而list是可变对象，最常用的key是字符串str**

# 定义函数
定义一个函数要使用def语句，依次写出函数名、括号、括号中的参数和冒号:，然后，在缩进块中编写函数体，函数的返回值用return语句返回
```python
def my_abs(x):
    if x >= 0:
        return x
    else:
        return -x
```
## 返回多值

```python
import math

def move(x, y, step, angle=0):
    nx = x + step * math.cos(angle)
    ny = y - step * math.sin(angle)
    return nx, ny

 x, y = move(100, 100, 60, math.pi / 6)
print(x, y)
```
**Python函数返回的仍然是单一值，实际上返回值是一个tuple！返回一个tuple实际上可以省略括号（）**

## 函数参数问题
Python中定义函数有五种参数：**必选参数、默认参数、可变参数、关键字参数和命名关键字参数**
Python的函数定义非常简单，但灵活度却非常大。除了正常定义的必选参数外，还可以使用默认参数、可变参数和关键字参数
如：**def power(x, n=2): #是默认参数，默认参数必须指向不变对象！**

### 可变参数
可变参数允许你传入0个或任意个参数，这些可变参数在函数调用时自动组装为一个**tuple**
```python

def calc(*numbers): #表示的是参数numbers接收到的是一个tuple
    sum = 0
    for n in numbers:
        sum = sum + n * n
    return sum

  调用的时候
  calc(1,2,3)
  或者 nums = [1,2,3]
       calc(*nums) #*nums表示把nums这个list的所有元素作为可变参数传进去

```

### 关键字参数
关键字参数允许你传入0个或任意个含参数名的参数，这些关键字参数在函数内部自动组装为一个**dict**
下例中**kw为关键字参数，调用函数时可以只传入必选参数，关键字参数可以不传入。

```python
def person(name, age, **kw):
    print('name:', name, 'age:', age, 'other:', kw)

    >>> person('Michael', 30)
    name: Michael age: 30 other: {}

  >>> extra = {'city': 'Beijing', 'job': 'Engineer'}
  >>> person('Jack', 24, city=extra['city'], job=extra['job'])
name: Jack age: 24 other: {'city': 'Beijing', 'job': 'Engineer'}

>>> person('Jack', 24, **extra)
name: Jack age: 24 other: {'city': 'Beijing', 'job': 'Engineer'} # **extra表示把extra这个dict的所有key-value用关键字参数传入到函数**kw中

```
### 命名关键字参数
限制关键字参数的名字，就可以用命名关键字参数，例如，只接收city和job作为关键字参数。这种方式定义的函数如下：

```python

def person(name, age, *, city, job):
    print(name, age, city, job)

如果函数定义中已经有了一个可变参数，后面跟着的命名关键字参数就不再需要一个特殊分隔符*了：
def person(name, age, *args, city, job): # name, age是位置参数，args是可变参数（tuple），city和job是命名关键字参数
    print(name, age, args, city, job)

```
### 5种参数的混合使用

```python
def f1(a, b, c=0, *args, **kw): # args是可变参数（tuple），kw是关键字参数（dic）
    print('a =', a, 'b =', b, 'c =', c, 'args =', args, 'kw =', kw)

def f2(a, b, c=0, *, d, **kw): #分别是ab是必选参数，c是默认参数，d是命名关键字参数，kw是关键字参数
    print('a =', a, 'b =', b, 'c =', c, 'd =', d, 'kw =', kw)


```
## 函数总结
对于任意参数，都可以通过类似 **func(*args, **kw)** 调用，注意两点：

- args是可变参数，args接收的是一个tuple；
- kw是关键字参数，kw接收的是一个dict。
# Reference
[liaoxuefeng的博客](http://www.liaoxuefeng.com/wiki/0014316089557264a6b348958f449949df42a6d3a2e542c000/0014316724772904521142196b74a3f8abf93d8e97c6ee6000)
