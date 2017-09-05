---
title: 'Python基础学习之[高阶函数]'
copyright: true
date: 2017-07-09 20:26:54
categories: Python
tags:
- Python
- Programming language
---
# 函数式编程（Function Programming）
它是一种抽象程度很高的编程范式，纯粹的函数式编程语言编写的函数没有变量，因此，任意一个函数，只要输入是确定的，输出就是确定的，这种纯函数我们称之为没有副作用，而允许使用变量的程序设计语言，由于函数内部的变量状态不确定，同样的输入，可能就得到不同的输出，因此，这种函数是有副作用的。 Python不是纯函数式编程语言，允许使用变量。
函数式编程的一个最大的特点是允许函数本身作为参数传入另一个函数中，还允许返回一个函数。
<!--more-->

## 高阶函数

函数名也是变量，函数名其实就是指向函数的变量。
把函数作为参数传入，这样的函数称为高阶函数，函数式编程就是指这种高度抽象的编程范式。

```python
def add(x,y,f):
    return f(x)+f(y)

>>>add(-5,-6,abs) #将函数名作为参数传入定义的函数中
>>>11
```

## map/reduce

**map**
```python
def f(x):
    return x*x

>>> r=map(f,[1,2,3,4,5]) #表示的是将传入的函数依次作用到序列的每一个元素，这个就是map的作用。此时r是一个Iterator，Iterator是惰性序列，可以通过list()函数让它把整个序列都计算出来返回到一个list
>>> list(r)
[1, 4, 9, 16, 25]

```

**reduce**
reduce 把一个函数作用在一个序列 [x1,x2,x3,x4]上，这个函数必须接收两个参数，reduce把结果继续和序列的下一个元素做累积计算，效果如下：

`reduce(f,[x1,x2,x3,x4])=f(f(f(x1,x2),x3),x4)`

```python
from functools import reduce
def str2int(s):

    def fn(x,y):
        return x*10+y

    def char2num(s):
        return {'0':0,'1':1,'2':2, '3':3, '4':4, '5':5, '6':6, '7':7, '8':8, '9':9}[s]

    return reduce(fn,map(char2num,s)) #可以使用reduce和map一起，写一个str2int函数

       # 可以用lambda函数优化，reduce（lambda x，y：x*10+y，map（char2num,s））

lambda x,y:x*10+y 表示的是以x，y为输入，x*10+y为输出返回，它的主体是一个表达式，，不是代码块，起到函数速写的作用。

```

**map和reduce的综合应用**
```python
def str2float(s):
    def char2num(s):
        return {'0':0,'1':1,'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9}[s]
    if '.' in s:
        L=s.split('.')
        left_part=reduce(lambda x,y:x*10+y,map(char2num,L[0]))
        # 123.456
        right_part=reduce(lambda x,y:x/10+y,map(char2num,L[1][::-1]))/10
        return left_part + right_part
    else:
        return reduce(lambda x,y:x*10+y,map(char2num,s))


```

## filter()
用于过滤序列，和map()类似，把传入的函数依次作用于每个元素，然后根据返回值是True 或者是false决定保留还是丢弃该元素，也就是说传入的函数返回值是true或者false，该传入的函数是筛选函数。filter()函数返回的是一个Iterator，是一个惰性序列，需要list（）返回所有结果。

```python
def _odd_iter(): #求素数
    n=1;
    while True:
        n=n+1
        yield n

def _not_divisible(n):
    return lambda x:x%n>0

def primes():
    sequence=_odd_iter()
    while True:
        n=next(sequence)
        yield n
        sequence=filter(_not_divisible(n),sequence) #使用过滤函数，将2,3,5.。。的倍数去掉

for n in primes():
    if n<1000:
        print(n)
    else:
        break
```

## sorted()
排序函数，是一个高阶函数，可以接收一个key函数来实现自定义排序

```Python
>>> sorted([-32,5,-6,-12,9,-20],key=abs)
[5, -6, 9, -12, -20, -32] #key代表排序函数，不能替换成其他字符。

>>> sorted(['bob', 'about', 'Zoo', 'Credit'], key=str.lower) #忽略大小写
['about', 'bob', 'Credit', 'Zoo']

>>> sorted(['bob', 'about', 'Zoo', 'Credit'], key=str.lower, reverse=True)
['Zoo', 'Credit', 'bob', 'about']  #反向排序
```

# 返回函数
高阶函数既可以接受函数作为参数，也可以把函数作为结果值返回。

```python

def layz_sum(*args):
    def sum():
        ax=0
        for n in args:
            ax=ax=n
        return ax
    return sum

f=layz_sum(1,2,3,4)
f()        
```
# 匿名函数

关键字lambda表示匿名函数，`lambda x:x*x`表示的是：

```python

def f(x):
    return x*x
```

匿名函数的好处是，函数没有名字，不用担心函数名冲突，不用写return，冒号后面的就是返回值，匿名函数也是一个函数对象，可以赋值给一个变量，利用变量来调用函数。每个函数对象

# 装饰器(Decorator)

代码运行期间动态增加功能的方式为装饰器, 本质上，decorator是一个返回函数的高阶函数，语法是：

```python
import functools

def log(func): #这个就是装饰器，可以用来打印日志
    @functools.wraps(func) #保持原来的func函数的__name__属性
    def wrapper(*args,**kw):
        print('call %s():'%func.__name__)
        return func(*args,**kw) #调用被装饰的函数
    return wrapper

@log #将装饰器放在函数定义处，相当于now =log(now)，有点像截留的意思
def now():
    print('2017-7-6')


import functools
def log(text=None): #将有参数和无参数的装饰函数结合
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args,**kw):
            if not isinstance(text,str):
                print('before call %s()' %func.__name__)
            else:
                print('before %s %s()' %(text,func.__name__))

            result = func(*args,**kw) #使用变量保存被装饰函数调用的结果

            if not isinstance(text,str)
                print('after call %s()' %func.__name__)
            else:
                print('after %s %s()' %(text,func.__name__))

        return wrapper
    return decorator

@log('execute') #从这里加参数，或者可以不加参数
def now():
    print('2017-06-20')

@log()
def now():
    print('2017-06-20')
```

# 偏函数(Partial function)

在模块functools中，functools.partial 是创建一个偏函数，例如：

```python
import functools
int2 = functools.partial(int,base=2) #等同于：

def int2(x,base=2) #将base=2传入下面的int中的base
    return int(x,base)
```
# Reference
[liaoxuefeng的博客](http://www.liaoxuefeng.com/wiki/0014316089557264a6b348958f449949df42a6d3a2e542c000/0014317848428125ae6aa24068b4c50a7e71501ab275d52000)
