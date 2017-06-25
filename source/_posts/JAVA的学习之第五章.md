---
title: JAVA的学习之第五章
date: 2017-02-17
tags: JAVA
---

本章主要是讲述OOP中的**继承（inheritance）**，利用继承，人们可以基于已存在的类构造一个新类，继承已存在的类也就是复用这些类的方法和域。
<!-- more -->

## 一、类、超类和子类

继承的定义：
```
class Manager extends Employee//Java 用关键字extends代替C++中的冒号：，Java中所有的继承都是公有继承，没有私有继承和保护继承
{
//add new files and methods
}

Employee称为超类（superclass），基类（base class）或父类（parent class）；Maanager称为子类（subclass）、派生类（derived class）或孩子类（child class）。
```
### 1. 易错点：

```
Manager boss=new Manger(...);
Employee[] staff=new Employee[3];
staff[0]=boss;

boss.setBonus(5000);//OK
staff[0].setBonus(5000);//EROR

Manager m=staff[i];//EROR
Employee[] staff=managers;//OK
Manager boss=(Manager) staff[0];//ok
```
上个例子中，变量staff[0]与boss引用同一个对象，编译器将staff[0]看成Employee对象，故语句6错误；
语句8错误的原因，并不是所有的雇员都是经理，小不能赋值给大；
语句9正确的原因，所有的经理都是雇员，大（子类，大指的是域值大）可以赋值给小（父类）；
总结：**只能大赋小**
语句10正确的原因，父类赋值给子类必须进行强制类型转换，编译通过（本身staff[0]就是存储Manager类对象，只不过staff是Employee类的对象数组）

**注意**：在将父类转换为之类之前，应该使用__instanceof__进行检查。

## 二、JAVA中 Object类是所有类的超类

### 1.有关散列hasCode的问题：
```
String s="OK";
StringBuilder sb=new StringBuilder(s);
System.out.println(s.hashCode()+" "+sb.hasCode());
String t=new String("OK");
StringBuilder tb=new StringBuilder(t);
System.out.println(t.hashCode()+""+tb.hasCode());
```
打印出来可知，字符串s和t拥有相同的散列码，**字符串的散列码是由内容导出的，所以字符串的散列码相等，字符串缓冲sb与tb有着不同的散列码，散列码是该对象的存储地址，可以看到不相等**

### 2.toString方法
绝大多数的toString方法，遵循以下格式：
类的名字，随后是一对方括号起来的域值；
```
public String toString()
{
return getClass().getName()+"[name="+name+",salary="+salary+",hireDay"+hireDay+"]";
}
```
只要对象与一个字符串通过操作符__“+”__连接起来，Java编译就会自动地调用toString方法，获得对象的字符串描述；

### 3.泛型数组列表
主要是实现动态数组
 ```
 ArrayList<Employee> staff=new ArrayList<>(填写初始容量);//在添加或删除元素时，具有自动调节数组容量的功能；
 ```
 ArrayList是一个采用类型参数的范类型
