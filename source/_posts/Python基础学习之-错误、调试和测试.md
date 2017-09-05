---
title: 'Python基础学习之[错误、调试和测试]'
copyright: true
date: 2017-07-11 21:51:21
categories: Python
tags:
- Python
- Programming language
---

# 错误、调试和测试
学会Python的错误处理及程序的调试方式
<!--more-->

## 错误处理
Python内置了一套`try...except...finally`的错误处理机制：
```python
try:
    print('try...')
    r=100/int('a')
    print('could be divide,result:',r)
except ValueError as e:
    print('ValueError:'e)
except ZeroDivisionError as e:
    print('ZeroDivisionError:',e)
else:
    print('no errors!')
finally:
    print('finally...')
print('END')
```
和java中一样，try后面的是我们认为可能会出错的代码块，如果代码块某一行执行出错，则从该行代码后的都不会继续执行，直接跳到错误处理的代码块，即except语句块（可以有多个），执行完此语句块后，如果有finally语句块，则执行finally语句块。也就是finally语句块一定会执行。

Python的错误是class，具有继承关系，except不但捕获该类型的错误，也将其 **子类的错误** 也一网打尽。

如果程序没有被捕获，它就会一直往上抛（调用堆栈），最后被Python解释器捕获，打印错误信息（在错误堆栈中），然后 **程序退出。**

## 记录错误
我们可以捕获错误（使用`try...except`），打印出错误信息，同时最重要的是让程序继续执行下去。
Python使用`logging`模块，记录错误信息.
```python
import logging

def foo(s):
    return 10/int(s)

def bar(s):
    return foo(s)*2

def main():
    try:
        bar('0')
    except Exception as e:
        logging.exception(e)  #将错误记录在日志文件中
main()
print('END') #这一句可以继续执行

输出：

ERROR:root:division by zero
Traceback (most recent call last):
  File "TestPython.py", line 198, in main
    bar('0')
  File "TestPython.py", line 194, in bar
    return foo(s)*2
  File "TestPython.py", line 191, in foo
    return 10/int(s)
ZeroDivisionError: division by zero
END
```

## 抛出错误
 ** 使用`raise`语句抛出一个错误实例。 **   首先要定义一个错误的class，选择好继承关系，然后使用`raise`语句抛出一个错误的实例：
```python
方式一：（知道如何处理错误）
class FooError(ValueError): #定义一个错误的class，继承来自ValueError
    pass

def foo(s):
    n=int(s)
    if n==0:
        raise FooError('invalid value:%s' %s) #使用raise抛出错误信息，实际上是创建一个该class的实例。
    return 100/n

foo('0')
输出：
    Traceback (most recent call last):
      File "TestPython.py", line 213, in <module>
        foo('0')
      File "TestPython.py", line 210, in foo
        raise FooError('invalid value:%s' %s) #使用raise抛出错误信息，实际上是创建一个该class的实例。
    __main__.FooError: invalid value:0

方式二：不知道如何处理错误，原样抛出错误。
def foo(s):
    n=int(s)
    if n==0:
        raise ValueError('invalid value:%s' %s)
    return 100/n

def bar():
    try: #首先使用try...except捕获错误
        foo('0')
    except ValueError as e:
        print('ValueError!') #打印出错误，无法处理，使用raise原样抛出
        raise #raise不带参数，就原样抛出
bar()
输出：
ValueError!
Traceback (most recent call last):
  File "TestPython.py", line 228, in <module>
    bar()
  File "TestPython.py", line 223, in bar
    foo('0')
  File "TestPython.py", line 218, in foo
    raise ValueError('invalid value:%s' %s)
ValueError: invalid value:0

```

## 调试程序
- 第一种方法，使用`print()`将可能出现问题的点或者可能有问题的变量打印出来
- 第二种方法，使用断言`assert`替代`print()`
```python
def foo(s):
    n=int(s)
    assert n!=0, 'n is zero!' #断言表示的意思是，n！=0应该是true，否则后面会执行出错误，如果断言失败，该语句抛出AssertionError错误
    return 100/n
```
- 第三种方法，使用`logging`替换`print()`:

```python

import logging
logging.basicConfig(level=logging.INFO)
    # 记录的信息具有优先级别，debug，info，warning，error，优先级依次增大
    # 当指定level为WARNING时，logging.info就不起作用了

s='0'
n= int(s)
logging.info('n=%d' %n)
print(100/n)

输出：
INFO:root:n=0
Traceback (most recent call last):
  File "TestPython.py", line 236, in <module>
    print(100/n)
ZeroDivisionError: division by zero

如果将level改为WARNING,则日志不起作用：
Traceback (most recent call last):
  File "TestPython.py", line 238, in <module>
    print(100/n)
ZeroDivisionError: division by zero #这个是解释器捕获的异常，直接退出了程序
```

- 使用Python的调试器pdb，程序以单步方式运行。
使用命令`python -m pdb TestPython.py`启动，输入字母 **l** 查看代码，字母 **n** 单步执行，输入`p 变量名`来查看变量的值，命令 **q** 退出pdb调试。
可以使用`pdb.set_trace()`设置断点。

```python

import pdb
s='0'
n= int(s)
pdb.set_trace() #程序运行到这，自动暂停，进入pdb调试环境
print(100/n)

```

- **使用IDE**，如 **pycharm**,比较方便设置断点、单步执行，比较方便进行调试。


## 单元测试
单元测试是用来对一个模块、一个函数或者一个类来进行正确性检验的测试工作，类似于“测试驱动开发”（TDD：Test-Driven Development）的方法。
以测试为驱动的开发模式，最大的好处是确保一个程序模块的行为符合我们设计的测试用例，将来修改的时候，可以极大程度的保证该模块的行为仍然是正确的。
例如我们新建一个MyDict类，这个类的行为和dic一致：

```python
class MyDict(dict):
    def __init__(self, **kw):
        super().__init__(**kw)

    def __getattr__(self,key):
        try:
            return self[key]
        except KeyError:
            raise AttributeError(r"'Dict' object has no attribute '%s'" %key)

    def __setattr__(self,key,value):
            self[key] = value    

```

编写单元测试，引入unittest模块，编写测试脚本（可以一次批量允许多个单元测试）：

```python
import unittest
from TestPython import MyDict
class TestDict(unittest.TestCase):

    def setUp(self): #setUp和tearDown函数会在每调用一个测试方法的前后分别被执行
        print('setUp...')

    def tearDown(self): #基于这样的特性，比如可以在setUp中连接数据库，tearDown中关闭数据库
        print('tearDown...')


    def test_init(self):
        d=MyDict(a=1,b='test')
        self.assertEqual(d.a,1)
        self.assertEqual(d.b,'test')
        self.assertTrue(isinstance(d,dict))

    def test_key(self):
        d=MyDict()
        d['key']='value'
        self.assertEqual(d.key,'value')

    def test_attr(self):
        d=MyDict()
        d.key='value'
        self.assertTrue('key' in d)
        self.assertEqual(d['key'],'value') # 通过断言函数得到的两者应该相等

    def test_keyerror(self):
        d=MyDict()
        with self.assertRaises(KeyError): #通过断言抛出指定错误
            value=d['empty']

    def test_attrerror(self):
        d=MyDict()
        with self.assertRaises(AttributeError):
            value=d.empty

if __name__ == '__main__':
    unittest.main()
测试结果：
D:\coder\Python\6.27>python test.py
setUp...
tearDown...
.setUp...
tearDown...
.setUp...
tearDown...
.setUp...
tearDown...
.setUp...
tearDown...
.
----------------------------------------------------------------------
Ran 5 tests in 0.008s

OK


```


# 文档测试（doctest）

Python内置的“文档测试”（doctest）模块可以直接提取注释中的代码并执行测试。

```python
class MyDict(dict):
    '''
    doctest(文档测试)
    simple dict but also support access as x.y style.

    >>> d1=MyDict()
    >>> d1['x']=100
    >>> d1.x
    100
    >>> d2=MyDict(a=1,b=2,c='3')
    >>> d2.c
    '3'
    >>> d2['empty']
    Traceback (most recent call last):
        ...
    KeyError: 'empty'
    >>> d2.empty
    Traceback (most recent call last):
        ...
    AttributeError: 'MyDict' object has no attribute 'empty'
    '''
    def __init__(self, **kw):
        super().__init__(**kw)

    def __getattr__(self,key):
        try:
            return self[key]
        except KeyError:
            raise AttributeError(r"'Dict' object has no attribute '%s'" %key)

    def __setattr__(self,key,value):
            self[key] = value    

if __name__ == '__main__': #必须加上这个，才能运行脚本
    import doctest #导入该doctest模块
    doctest.testmod()

如果将__getattr__函数注释掉，再运行该脚本，则会报错：

D:\coder\Python\6.27>python TestPython.py
**********************************************************************
File "TestPython.py", line 248, in __main__.MyDict
Failed example:
    d1.x
Exception raised:
    Traceback (most recent call last):
      File "C:\Users\40239\AppData\Local\Programs\Python\Python35\lib\doctest.py", line 1321, in __run
        compileflags, 1), test.globs)
      File "<doctest __main__.MyDict[2]>", line 1, in <module>
        d1.x
    AttributeError: 'MyDict' object has no attribute 'x'
**********************************************************************
File "TestPython.py", line 251, in __main__.MyDict
Failed example:
    d2.c
Exception raised:
    Traceback (most recent call last):
      File "C:\Users\40239\AppData\Local\Programs\Python\Python35\lib\doctest.py", line 1321, in __run
        compileflags, 1), test.globs)
      File "<doctest __main__.MyDict[4]>", line 1, in <module>
        d2.c
    AttributeError: 'MyDict' object has no attribute 'c'
**********************************************************************
File "TestPython.py", line 257, in __main__.MyDict
Failed example:
    d2.empty
Expected:
    Traceback (most recent call last):
        ...
    AttributeError: 'Dict' object has no attribute 'empty'
Got:
    Traceback (most recent call last):
      File "C:\Users\40239\AppData\Local\Programs\Python\Python35\lib\doctest.py", line 1321, in __run
        compileflags, 1), test.globs)
      File "<doctest __main__.MyDict[6]>", line 1, in <module>
        d2.empty
    AttributeError: 'MyDict' object has no attribute 'empty'
**********************************************************************
1 items had failures:
   3 of   7 in __main__.MyDict
***Test Failed*** 3 failures.
```
# Reference
[liaoxuefeng的博客](http://www.liaoxuefeng.com/wiki/0014316089557264a6b348958f449949df42a6d3a2e542c000/001431913726557e5e43e1ee8d54ee486bddc3f607afb75000)
