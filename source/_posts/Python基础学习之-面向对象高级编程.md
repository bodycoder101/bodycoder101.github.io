---
title: 'Python基础学习之[面向对象高级编程]'
copyright: true
date: 2017-07-10 20:21:53
categories: Python
tags:
- Python
- Programming language
---

# 面向对象编程(OOP)

面向过程的程序设计把计算机程序视为一系列命令的集合，典型的面向过程的思想是把函数切分成子函数，把大块的函数通过切割成小块函数来降低系统的复杂性；

而面向对象的程序设计把计算机程序视为一组对象的集合，而每个对象都可以接收其他对象发过来的消息，处理这些消息，程序的执行就是一系列消息在各个对象之间的传递；面向对象设计思想是抽象出class，根据class创建出Instance。

<!--more-->

```python
std1={'name':'Michael','score':90} #使用面向过程的方式，将学生用一个dic表示
std2={'name':'Li','score':100}

def Print_score(std):
    print('%s: %s' %(std['name'],std['score']))
Print_score(std1)
Print_score(std2)

class Student(object): #面向对象的方式，将学生定义为一个class，里面有各种处理对象的函数
    def __init__(self,name,score): #第一个参数永远是self，表示创建的实例本身，因此，在__init__内部，可以把各种属性绑定到self，self指向创建的实例本身，还需注意的是，有了这个方法，在创建实例的时候，就不能传入空的参数了
        self.name=name
        self.score=score
    def Print_score(self):
        print('%s: %s' %(self.name,self.score))

Michael=Student('Michael',90)
Li = Student('Li',100)
Michael.Print_score()
Li.Print_score()

```

## 类和实例（Class & Instance）
Class 是抽象的模板，是创建实例的模板
Instance 是根据类创建出来的一个个具体的对象，各个实例拥有的数据相互独立，互不影响
Method 是于实例绑定的函数，在类中定义，和普通函数不同，方法可以直接方问实例的数据

```python

class Student(object): #class 后面是类名，类名通常是大写开头的单词，object表示的是从哪个类继承下来，没有合适的继承类，那就使用公共父类object
    pass

bar=Student()
bar.name='LI' #可以给一个实例绑定属性
bar.score=90

```

## 访问限制（Access Restriction）

- 若要让内部属性不被外部访问，可以把属性的名称前加上两个下划线`__`,变量名如果以`__`开头，说明这个变量是一个私有变量（Private），只有内部可访问，外部不能访问；
- 如果看到一个下划线`_`开头的实例变量，这个变量是可以直接访问的，但是约定俗成是“虽然可以被访问，但请把我视为私有变量，不要随意访问”

```python
class Student(object):

    def __init__(self,name,score):
        self.__name=name
        self.__score=score

        >>> bar=Student('Li',100)
        >>> bar.__name
        Traceback (most recent call last):
          File "<stdin>", line 1, in <module>
        AttributeError: 'Student' object has no attribute '__name'#外部无法直接访问实例变量

    def get_name(self): #通过创建get和set函数来允许外部获得和修改属性
        return self.__name #私有变量都是连个下划线的

    def get_score(self):
        return self.__score#该变量被Python解释器自动处理为:_Student__score

    def set_name(self,name):
        if isinstance(name,str):#在set方法中可以对参数进行检查，避免传入无效的参数
            self.__name=name
        else:
            raise ValueError('bad name')

    def set_score(self,score):
        if 0<=score<=100:
            self.__score=score
        else:
            raise ValueError('bad score')


```

## 继承和多态（ Inheritance and Polymorphic）

```python
class Animal(object):
    def run(self):
        print('Animal is running...')

class Dog(Animal): #继承了Animal父类的属性，拥有了run方法
    def run(self):
        print('Dog is running...')
    def eat(self):
        print('Eating meat...')

class Cat(Animal):
    def run(self): #重写（overwrite）了父类的run方法，会覆盖父类的同名方法，调用时自动调用自身的run方法，实现了多态（polymorphic）
        print('Cat is running...')


def run_twice(Animal):
    Animal.run()
    Animal.run()

    >>> run_twice(Animal())
    Animal is running...
    Animal is running...

    >>> run_twice(Dog())
    Dog is running...
    Dog is running...

    >>> run_twice(Cat())
    Cat is running...
    Cat is running...

class Timer(object): #验证动态语言在多态上的差别
    def run(self):
        print('Start...')

    >>> run_twice(Timer())
    Start...
    Start...

```
多态：调用方只管调用，不用管细节，**开闭原则：**
- 对扩展开放：允许新增`Animal`子类；
- 对修改封闭：不需要修改依赖`Animal`类型的`run_twice`函数

**静态语言Vs动态语言** 在多态上的表现差别：
- 静态语言（如C++）来说，如果传入的是`Animal`类型，传入的对象必须是`Animal`类型或者是它的子类型，否则无法调用`run()`方法；
- 动态语言（如Python）来说，不一定需要传入`Animal`类型或者子类型，只需要保证传入的对象有`run()`方法。
- 比如类`Timeir`可以调用`run_twice`,这个就是动态语言的鸭子类型，一个对象只要“看起来像鸭子，走起路来像鸭子”，那它就被视作鸭子
- Python中的“file-like object”就是一种鸭子类型。

## 获取对象信息（使用常见函数）

- type(): **基本类型（int，str）、一个变量指向的函数或类（上例子中的Animal）** 可以使用type()函数判断，返回的是对应的`Class`类型
```python
>>> type(a)
<class '__main__.Animal'>
```

- isinstance(): 判断`class`的类型，也可以判断一个变量是否是某些类型中的一种
```python
>>> isinstance([1,2,3],list)
True
>>> isinstance((1,2,3),tuple)
True
>>> isinstance((1,2,3),(tuple,list))
```

- dir(): 可以获取一个对象的所有属性和方法，返回一个包含字符串的list;
```python
>>> dir(li)
['_Student__name', '_Student__score', '__class__', '__delattr__', '__dict__', '__dir__', '__doc__', '__eq__', '__format__', '__ge__', '__getattribute__', '__gt__', '__hash__', '__init__', '__le__', '__lt__', '__module__', '__ne__', '__new__', '__reduce__', '__reduce_ex__', '__repr__', '__setattr__', '__sizeof__', '__str__', '__subclasshook__', '__weakref__', 'get_name', 'get_score', 'set_name', 'set_score']
```
- 其他方法
可以配合使用`getattr()、setattr()、hasattr()`来操作一个对象的状态

```python
>>> hasattr(li,'__name')
False
>>> hasattr(li,'_Student__name')
True
>>> hasattr(li,'set_score')
True
>>> getattr(li,'_Student__name')
'li'
>>> setattr(li,'_Student__name','Cheng')
>>> getattr(li,'_Student__name')
'Cheng'
>>>
```
## 类属性和实例属性
- 给实例绑定属性的方法：通过实例变量或者`self`变量
- 给类本身绑定属性：直接在class中定义属性，这种属性是类属性，归该类所有，但类的所有实例都可以访问

```python
 >>> class Animal(object):
...     name='Animal' #类属性
...
>>> dog=Animal()
>>> print(dog.name)
Animal
>>> print(Animal.name)
Animal
>>> dog.name='Dog' #使用实例绑定name属性
>>> print(dog.name)#实例同名属性比类属性优先级高，因此会屏蔽掉类属性
Dog
>>> print(Animal.name)
Animal
>>> del dog.name #删除实例的name属性
>>> print(dog.name)
Animal
>>>

Note：编写程序的时候尽量避免实例属性和类属性使用相同的名字，否则实例属性将会屏蔽类属性，得到意想不到的结果。
```

# 面向对象高级编程

- 动态语言的灵活性：定义一个class，并创建一个class实例后，可以对该实例绑定任何属性和方法(只作用在该实例)；也可以给class绑定一个方法或者属性，对该class的所有实例起作用

```python
class Student(object):
    pass

s=Student()
s.name='Michael' #动态给实例绑定属性
>>> print(s.name)
Michael

def set_age(self,age):
    self.age=age

from types import MethodType
s.set_age=MethodType(set_age,s) #给实例动态绑定一个方法
s.set_age(18)
>>> s.age
18

s2=Student() #创建新的实例，测试是否s的属性是否存在于s2
>>> print(s2.name)
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
AttributeError: 'Student' object has no attribute 'name'

>>> s2.set_age(19)
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
AttributeError: 'Student' object has no attribute 'set_age'

Student.set_age=set_age #给class绑定方法，该方法对student的所有实例起作用
>>> s2.set_age(19)
>>> s2.age
19
```
- 使用`__slots__`限制实例的属性: 例如只允许对`Student`实例添加`name`和`age`属性，可以在定义`Student`class的时候，使用__slots__，要注意的是，使用该方法定义的属性只对 **当前类的实例** 起作用，对继承的子类不起作用

```python
class Student(object):
    __slots__=('name','age')

>>> s=Student()
>>> s.name='li'
>>> s.age=25
>>> s.score=100 #报错，无法绑定属性score
Traceback (most recent call last):
File "<stdin>", line 1, in <module>
AttributeError: 'Student' object has no attribute 'score'

class PostGraduateStudent(Student):
    pass

>>> g=PostGraduateStudent()
>>> g.score=100
>>> g.score
100

```
## 装饰器@property
实现既能检查参数，又可以用类似属性的方式来访问类的变量,如下例，可以直接使用`s.score=90`的方式来设置属性，并且可以有限制。

```python
class Student(object):
    @property  #相当于get_score方法
    def score(self):
        return self._score

    @score.setter #相当于set_score方法
    def score(self, value):
        if not isinstance(value,int):
            raise ValueError('score must be an integer!')
        if value<0 or value>100:
            raise ValueError('score must between 0~100!')
        self._score=value

>>> s=Student()
>>> s.score=100 #实际上转化为s.set_score(100)
>>> s.score #实际转化为s.get_score()
100
>>> s.score='haha'#起到了限制属性的作用
Traceback (most recent call last):
File "<stdin>", line 1, in <module>
File "<stdin>", line 9, in score
ValueError: score must be an integer!

    #使用@property还可以定义只读属性，也就是只定义getter方法，不定义setter方法。
    @property #birth含有可读写属性
    def birth(self):
        return self._birth

    @birth.setter
    def birth(self,value):
        self._birth=value

    @property #age就只有一个只读属性，只有getter方法
    def age(self):
        return 2017-self._birth

```
## 多重继承（MixIn）
主线用正常的方式继承，副线用MixIn继承（只是起个名字而已,加在后面），如：
```python
class Dog(Mammal,RunnableMixIn,CarnivorousMixIn):
    pass

```

## 定制类

Python中，**[__xxx__]** 类似于这样的变量或者函数名，在Python中有特殊用途，可以用来定制类，定制类中各种返回的特殊值。

```python
class Student(object):
    def __init__(self, name):
        self.name = name

    def __str__(self): #这个有点类似于java中的toString方法
        return 'Student object (name: %s)' %self.name
    __repr__=__str__ #两者的区别是，__str__返回用户看到的数据，__repr__返回开发者看到的数据，是为调试服务的。

    def __call__(self):#实现对实例本身的调用，返回相应的属性。即可以将实例看做是一个函数进行调用。
    print('My name is %s.' %self.name)

    >>> print(Student('Li'))
    Student object (name: Li)
    >>> s=Student('Li')
    >>> s
    Student object (name: Li)
    >>> s()
    My name is Li.

class Fib(object):
    def __init__(self):
        self.a,self.b=0,1
    def __iter__(self): #定义迭代器的方法，可以使用for...in循环
        return self
    def __next__(self):
        self.a, self.b= self.b, self.a+self.b #计算下一个值，本身进行迭代
        if self.a>10000:
            raise StopIteration()
        return self.a
    def __getitem__(self,n): #定义getitem方法，实现像list一样按照下标取出元素
        a,b=1,1
        for x in range(n):
            a,b=b,a+b
        return a

            >>> for n in Fib():
            ...     print(n)
            ...
            1
            1
            2
            3
            5
            8
            13
            21
            34
            55
            89
            144
            233
            377
            610
            987
            1597
            2584
            4181
            6765
            >>> f=Fib()
            >>> f[10]
            89
            >>> f[100]
            573147844013817084101

            def __getitem__(self,n): #定义带有切片的getitem方法，可以使用f[1:5]切片取元素，返回一个list
                if isinstance(n,int):
                    a,b=1,1
                    for x in range(n):
                        a,b=b,a+b
                    return a
                if isinstance(n,slice):
                    if n.start is None:
                        n.start=0
                    a ,b=1,1
                    L=[]
                    for x in range(n.stop):
                        if x>n.start:
                            L.append(a)
                        a,b=b,a+b
                    return L

            >>> f=Fib()
            >>> f[0:5]
            [1, 2, 3, 5]               
```
## 使用枚举类（Enum）

```python
from enum import Enum
Month=Enum('Month',('Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'))

>>> for name,member in Month.__members__.items():
...     print(name,'=>',member,',',member.value)
...
Jan => Month.Jan , 1 #value值默认从1开始计数，也可以通过value值来获取枚举常亮，如果改变，则按照顺序增长。
Feb => Month.Feb , 2
Mar => Month.Mar , 3
Apr => Month.Apr , 4
May => Month.May , 5
Jun => Month.Jun , 6
Jul => Month.Jul , 7
Aug => Month.Aug , 8
Sep => Month.Sep , 9
Oct => Month.Oct , 10
Nov => Month.Nov , 11
Dec => Month.Dec , 12
```
## 使用元类（metaclass）
- type()函数：可以使用该函数返回一个对象类型，也可以创建出新的类型。
要创建一个class对象，`type()`依次传入三个参数：
1. class的名称
2. 继承的父类集合，如果只有一个父类，需要在该父类后加逗号（tuple的单元素写发）
3. class的方法名称和函数的绑定。下例中是函数fn绑定在方法名hello上。
```python
def fn(self,name='world'):
    print('Hello,%s.'%name)

Hello=type('Hello',(object,),dict(hello=fn))
```
- metaclass:
称为元类，先定义metaclass，然后创建类。可以把类看成是metaclass创建出来的“实例”。按照习惯，metaclass的类名总是以Metaclass结尾，表示这个是一个metaclass。**先定义metaclass，就可以创建类，然后创建实例**
讲的比较详细的看[链接](https://funhacks.net/2016/11/12/metaclass/)

# Reference
[liaoxuefeng的博客](http://www.liaoxuefeng.com/wiki/0014316089557264a6b348958f449949df42a6d3a2e542c000/00143186738532805c392f2cc09446caf3236c34e3f980f000)
