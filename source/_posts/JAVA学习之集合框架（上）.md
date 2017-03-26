---
title: Java学习之集合框架（上）
date: 2017-03-26 14:39:43
categories: Java SE
tags: Java
---
# 相关概念

框架（framework）是一个类的集合，奠定了创建高级功能的基础；Java中的集合类是一种工具类，相当于一个容器，可以存储任意数量的具有**共同属性**的对象；Java集合类库构成了集合类的框架，集合框架为集合的实现者定义了大量的接口和抽象类，基于此增加了代码的重用性。

# 集合的作用

 - 在类的内部对数据进行组织；
 - 简单而快速地搜索大数量的条目数据；
 - 提供统一的接口，将不同对象封装在一起，便于操作和管理；
 - 有的集合接口（List），提供了一系列有序的元素，并且可以在序列中间快速插入或者删除元素；
 - 有的集合接口（Map），提供映射关系，可以通过任意类型的关键字（Key）快速的找到对应的唯一对象（Value）。

# 集合和数组的选择

**为什么选择集合而不是数组？**
 1. 数组长度固定，并且同一个数组只能存放类型一样的数据（基本类型/引用类型）；
 2. 集合可以存储和操作数目不固定的一组数据；
 3. 若程序时不知道究竟需要多少对象，需要在空间不足时自动扩增容量，则需要使用容器类库，数组不适用；
 4. 查找元素时，数组需要一个个遍历查找，而集合（HashMap）可以通过任意关键字（Key）查找所映射的具体对象（Value），可以提高效率。

# 集合框架体系结构
![](https://raw.githubusercontent.com/bodycoder101/MarkdownPhotos/master/Java%E9%9B%86%E5%90%88%E6%A1%86%E6%9E%B6.png)
我们关注常用的几个接口：
![](https://raw.githubusercontent.com/bodycoder101/MarkdownPhotos/master/Java%E9%9B%86%E5%90%88%E6%A1%86%E6%9E%B6%E7%AE%80%E7%89%88.png)
- 从上面的集合框架图可以看到，第一层是父接口，包含两种类型集合（Collection）和图（Map）；
- 第二层是子接口，主要有List、Queue、Set接口，第三层是子接口对应的具体实现类；
- List（序列）集合中的元素是有序的且可以重复的，Set集合（数学中的集合概念）是无序的且不可重复的。

# 代码演示

**课程类（Course.java）**

```
package com.imooc.collection;

public class Course {

    public String id;
    public String name;

    public Course(String id, String name) {
        super();
        this.id = id;
        this.name = name;
    }
}

```

**学生类（Student.java)**

```
package com.imooc.collection;

import java.util.HashSet;
import java.util.Set;

public class Student {

    public String id;
    public String name;

    public Set<Course> courses;//使用泛型规定courses的类型

    public Student(String id, String name) {
        super();
        this.id = id;
        this.name = name;
        this.courses = new HashSet<Course>();//用set的实现类HashSet进行初始化
    }
}
```

**ArrayList增删改查（ListTest.java）**

```
package com.imooc.collection;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
public class ListTest {

    /*List中的元素是有序并且可以重复的*/
    public List CoursesToSelect;

    public ListTest(){
        //注意List是个接口，不能直接将其实例化
        this.CoursesToSelect = new ArrayList();
    }

    public void TestAdd(){

        /*---普通add测试---*/
        Course cr1 = new Course("1","数据结构");
        CoursesToSelect.add(cr1);


        /*---指定位置add测试，下挤---*/
        Course cr2 = new Course("2","常用算法");
        CoursesToSelect.add(0, cr2);//添加到第一个位置，会将原有的挤下去。


        /*---越界add测试---*/
        //Course cr3 = new Course("3","JAVA");
        //CoursesToSelect.add(3, cr3);
        /*
         * 注意！！
         * 0，1，2均不报错
         * 3报错：java.lang.IndexOutOfBoundsException  下标越界
         * */


        /*---普通组合add添加---*/
        Course[] courseList = {new Course("3","Javaweb"),new Course("4","数据库")};
        CoursesToSelect.addAll(Arrays.asList(courseList));


        /*---指定位置组合add添加---*/
        Course[] courseList2 = {new Course("5","高等数学"),new Course("6","计算机网络")};
        CoursesToSelect.addAll(2,Arrays.asList(courseList2));
    }

    public void testQueryAll(){  //查看全部元素
        System.out.println("普通遍历List");
        for(int i=0;i<CoursesToSelect.size();i++){
            /*对象存入集合都变成Object类型，取出时需要类型转换*/
            Course tempCourse = (Course) CoursesToSelect.get(i);
            System.out.println("课程"+(i+1)+":"+tempCourse.name+" 课程id:"+tempCourse.id);
        }
    }

    public void testIterator(){  //通过迭代器遍历List

        System.out.println("通过迭代器遍历List");
        //迭代器是用来遍历集合中的元素的，本身不具备任何存储元素的功能；依赖于某个集合存在，本身不能独立存在
        //迭代器本身是个接口，通过集合的iterator()方法，取得迭代器的实例
        Iterator it = CoursesToSelect.iterator();
        while(it.hasNext()){
            Course cr = (Course) it.next();
            System.out.println("课程:"+cr.name+" 课程id:"+cr.id);
        }
    }

    public void testForEach(){  //通过foreach遍历List

        System.out.println("通过foreach遍历List");
        for(Object obj:CoursesToSelect){
            Course cr = (Course)obj;
            System.out.println("课程:"+cr.name+" 课程id:"+cr.id);
        }
    }

    public void testModify(){  //修改
        CoursesToSelect.set(0, new Course("100","Spring"));
    }

    public void testRemove(){  //删除，记住每删除一次，元素都会上移

        CoursesToSelect.remove(1);//删除的第一种方式

        /*在上面删除位置1的元素后，后面的元素会整体上移，位置1又有了新元素，所以下面的语句是删除现在位置2的新元素*/
        Course cr = (Course) CoursesToSelect.get(2);   //删除的第二种方式
        CoursesToSelect.remove(cr);

        Course[] courseList =
                {(Course) CoursesToSelect.get(1),
                (Course) CoursesToSelect.get(2),
                (Course) CoursesToSelect.get(3)};
        CoursesToSelect.removeAll(Arrays.asList(courseList));   //删除的第三种方式，removeAll

    }

    public static void main(String[] args){

        ListTest lt = new ListTest();
        lt.TestAdd();
        lt.testQueryAll();
        lt.testIterator();
        lt.testModify();  //修改课程
        lt.testRemove();  //删除课程
        lt.testForEach();
    }
}
```

**Set集合的基本用法(SetTest.java)**

```
package com.imooc.collection;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Scanner;

public class SetTest {

    public List<Course> CoursesToSelect;
    public SetTest(){
        this.CoursesToSelect = new ArrayList<Course>();//待选课程是使用数组序列存放
    }

    public void TestAdd(){

        Course cr1 = new Course("1","数据结构");
        CoursesToSelect.add(cr1);


        Course cr2 = new Course("2","常用算法");
        CoursesToSelect.add(0, cr2);


        Course[] courseList = {new Course("3","Javaweb"),new Course("4","数据库")};
        CoursesToSelect.addAll(Arrays.asList(courseList));


        Course[] courseList2 = {new Course("5","高等数学"),new Course("6","计算机网络")};
        CoursesToSelect.addAll(2,Arrays.asList(courseList2));
    }

    public void testForEach(){  
        for(Course course:CoursesToSelect){
            System.out.println("课程:"+course.name+" 课程id:"+course.id);
        }
    }

    public static void main(String[] args){
        SetTest st = new SetTest();
        st.TestAdd();
        st.testForEach();

        //创建一个学生对象
        Student stu1= new Student("1","小明");
        System.out.println("欢迎"+stu1.name+"选课！");

        Scanner sc = new Scanner(System.in);
        for(int i=0;i<3;i++){

            System.out.println("请输入课程ID");
            String courseId = sc.next();

            for(Course course:st.CoursesToSelect){
                if(course.id.equals(courseId)){  //字符串是对象,其equals()方法比较的是实际内容！
                    stu1.courses.add(course); //将待选课程（使用ArrayList存储）中的对象course初始化学生类中的course域（使用HashSet存储）
                }
            }
        }

        st.testForEachForSet(stu1);
    }

    public void testForEachForSet(Student stu){

        //打印输出学生所选的课程
        //遍历Set中的元素只能用foreach或是iterator，不能想List那样用get(index)，因为Set是无序的。
        //Set中的元素是不可重复的，重复的添加Set只会保存一个该对象（的引用）
        //Set是可以添加空对象的，null
        //Set没有提供像List那样的set()方法，因为Set集合是无序的

        System.out.println("共选择了"+stu.courses.size()+"门课程");
        for(Course course:stu.courses){
            System.out.println(stu.name+"选择了"+course.name+" 课程id:"+course.id);
        }
        //没有介绍的关于Set的remove(),size()等方法，大致跟List一样
    }
}

```
-EOF

# 参考博文
[Java集合框架](http://blog.csdn.net/qq_33290787/article/details/51781036)
[Java - 集合框架完全解析](http://www.open-open.com/lib/view/open1474167415464.html)
