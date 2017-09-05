---
title: 'Python基础学习之[进程和线程]'
copyright: true
date: 2017-07-16 15:46:32
categories: Python
tags:
- Python
- Programming language
---

# 进程和线程（Process and Thread）
一个进程可以有多个线程，也可以有单个线程，但一个进程 **至少有一个** 线程，多进程和多线程的程序涉及到同步、数据共享的问题，编写起来要考虑的问题比较多。
多任务的实现方式一般有 **3种**：

- 多进程模式
- 多线程模式
- 多进程+多线程模式

**Python既支持多进程，又支持多线程**
<!--more-->

## 多进程（multiprocessing）
Python的`os`模块封装了常见的系统调用，比如`fork()`系统调用，该系统调用是创建一个与原来进程几乎完全相同的进程，一个进程调用 `fork()` 函数后，系统先给新的进程分配资源，例如存储数据和代码空间，然后把原来的进程的所有值都复制到新的进程中，只有少数值与原来的进程值不同，相当于克隆了一个自己。子进程永远返回0，而父进程返回子进程的ID，子进程调用`getppid()`拿到父进程的ID，而`getpid()`是得到本身的进程ID。 ** Windows 没有`fork`系统调用 。**

```python
import os
print('Process (%s) start...' %os.getpid())
pid = os.fork() #如果是子进程，则返回0，父进程是返回子进程的ID
if pid ==0:
    print('I am child Process (%s) and my parent is %s.' %(os.getpid(),os.getppid()))
else:
    print('I (%s) just created a child process (%s).' %(os.getpid(),pid))

结果如下：
[root@localhost Python]# python processing.py
Process (4563) start...
I am child Process (4564) and my parent is 4563.
I (4563) just created a child process (4564).

```

`multiprocessing`模块提供了`Process`类代表一个进程对象

```python
from multiprocessing import Process
import os

def run_proc(name):
    print('Run chilid process %s(%s)' %(name,os.getpid()))

if __name__ == '__main__':
    print('Parent process %s.' %os.getpid()) # 程序启动时，产生一个进程，拥有进程号
    p=Process(target=run_proc,args=('test',)) # p是子进程实例对象，由当前进程产生的进程。
    print('Child process will start...')
    p.start()
    p.join()
    print('Child process end...')

结果如下：
[root@localhost Python]# python processing.py
Parent process 4608.
Child process will start...
Run chilid process test(4609)
Child process end...


```

## 进程池（Pool）
如果需要启动大量的子进程，可以用进程池（Pool）的方式批量创建子进程。

```python
from multiprocessing import Pool #提供跨平台的多进程支持
import os, time, random

def long_time_task(name):
    print('Run task %s (%s)...' %(name,os.getpid()))
    start=time.time()
    time.sleep(random.random()*3)
    end=time.time()
    print('Task %s runs %0.2f seconds.'%(name,(end-start)))

if __name__ == '__main__':
    print('Parent process %s.' %os.getpid())
    p=Pool(4) #创建进程池，共有四个进程，默认的大小是CPU的核数，最多同时创建4个进程
    for i in range(5):
        p.apply_async(long_time_task,args=(i,)) # apply the async to invoke process， 使用异步的方式调用进程
    print('waiting for all subprocesses done...')
    p.close()
    p.join() #调用join方法会等待所有子进程执行完毕，之前必须调用close（）
    print('All subprocesses done...')

结果如下：
Parent process 4752.
waiting for all subprocesses done...
Run task 0 (4753)...
Run task 1 (4755)...
Run task 2 (4754)...
Run task 3 (4756)...
Task 3 runs 0.24 seconds.  #最多同时执行4个进程，只有结束了一个进程后，下个进程才能执行
Run task 4 (4756)...
Task 0 runs 0.47 seconds.
Task 4 runs 0.75 seconds.
Task 1 runs 1.18 seconds.
Task 2 runs 2.47 seconds.
All subprocesses done...

```

### 子进程及进程间的通讯

```python

import subprocess #该模块可以比较方便启动一个子进程，然后控制输入输出

print('$ nslookup www.python.org')
r= subprocess.call(['nslookup','www.python.org'])
print('Exit code:',r)


print('$ nslookup')
p=subprocess.Popen(['nslookup'],stdin=subprocess.PIPE, stdout=subprocess.PIPE,stderr=subprocess.PIPE)
output, err=p.communicate(b'set q=mx\npython.org\nexit\n') #子进程需要输入参数的话，使用communicate。
print(output.decode('utf-8'))
print('Exit code:',p.returncode)

运行结果如下：

[root@localhost Python]# python processing.py
$ nslookup www.python.org
Server:		114.114.114.114
Address:	114.114.114.114#53

Non-authoritative answer:
www.python.org	canonical name = python.map.fastly.net.
Name:	python.map.fastly.net
Address: 151.101.72.223

Exit code: 0
$ nslookup
Server:		61.177.7.1
Address:	61.177.7.1#53

Non-authoritative answer:
python.org	mail exchanger = 50 mail.python.org.

Authoritative answers can be found from:
python.org	nameserver = ns3.p11.dynect.net.
python.org	nameserver = ns2.p11.dynect.net.
python.org	nameserver = ns1.p11.dynect.net.
python.org	nameserver = ns4.p11.dynect.net.
mail.python.org	internet address = 188.166.95.178
mail.python.org	has AAAA address 2a03:b0c0:2:d0::71:1
ns1.p11.dynect.net	internet address = 208.78.70.11
ns2.p11.dynect.net	internet address = 204.13.250.11
ns3.p11.dynect.net	internet address = 208.78.71.11
ns4.p11.dynect.net	internet address = 204.13.251.11


Exit code: 0

```
进程间的通讯，在模块`multiprocessing`模块提供了`Queue`,`Pipes`等方式交换数据。这个交换可以是读，也可以是写。

```python
from multiprocessing import Process,Queue
import os,time,random

# process that write data
def write(q):
    print('Process to write: %s' %os.getpid())
    for value in ['A', 'B', 'C']:
        print('Put %s to queue...' %value)
        q.put(value)
        time.sleep(random.random()) #写进程稍微沉睡几秒


# process that read data
def read(q):
    print('Process to read: %s' %os.getpid())
    while True:
        value =q.get(True)
        print('Get %s from queue.' %value)

if __name__ == '__main__':

    #father process create Queue, and pass it to subprocess:
    q=Queue()

    pw=Process(target=write,args=(q,))
    pr=Process(target=read,args=(q,))

    # start subprocess pw, write data:
    pw.start()
    # start subprocess pr, read data:
    pr.start()
    # waite subprocess pw finish
    pw.join()
    # pr进程是死循环，见while true。
    pr.terminate()

结果是：
[root@localhost Python]# python processing.py
Process to write: 5229
Put A to queue...
Process to read: 5230
Get A from queue.
Put B to queue...
Get B from queue.
Put C to queue...
Get C from queue.

```

## 多线程
线程是操作系统直接支持的执行单元，Python的标准库提供两个模块：`_thread`和 `threading`,前者是低级模块，后者是高级模块，是对前者的封装。
启动一个线程就是把一个函数传入并创建`Thread`实例（一个方法，创建出来），然后调用`start()`开始执行：

```python
import time, threading

def loop():
    #函数current_thread()永远返回当前线程的实例
    print('thread %s is running...' %threading.current_thread().name)
    n=0
    while n<5:
        n=n+1
        print('thread %s ---> %s' %(threading.current_thread().name,n))
        time.sleep(1)
    print('thread %s ended.'%threading.current_thread().name)



print('thread %s is running...' %threading.current_thread().name)
t=threading.Thread(target=loop,name='Loopthread')
# 把一个函数传入，并创建线程实例，然后调用start开始执行
t.start()
t.join()
print('thread %s ended.'%threading.current_thread().name)
```

## 加锁（Lock）
可能存在读脏数据的问题，两个线程同时更新一个变量，导致出现意想不到的结果，所以多线程的时候，必须加锁（写的时候）。

```python
import time, threading

balance =0
lock=threading.Lock() #申请一把锁

def change(n):

    global balance
    balance =balance+n
    balance =balance-n

def run_thread(n):
    for i in range(100000):

        lock.acquire() #加锁，进行互斥访问

        try:
            change(n)
        finally:
            lock.release() #用完必须释放锁

t1=threading.Thread(target=run_thread,args=(5,))
t2=threading.Thread(target=run_thread,args=(8,))

t1.start()
t2.start()

t1.join()
t2.join()
print(balance)
```
Python解释器设计时带有 **GIL（Global Interpreter Lock）**，任何线程执行前，必须获得该锁，每100条字节码后，自动释放该锁，因而多线程无法利用多核。

## ThreadLocal

解决多线程局部变量传递，调用的问题。

```python
# 方式一，使用dic，避免参数的每层传递
global_dict={}

def std_thread(name):
    global_dict[threading.current_thread()] =std
    do_task_1()
    do_task_2()

def do_task_1():
    std = global_dict[threading.current_thread()]
    do something here

def do_task_2():
    std = global_dict[threading.current_thread()]
    do something here


# 方式二，使用ThreadLocal
import threading

local_school =threading.local() #创建全局变量ThreadLocal

def process_student():
    #获取当前线程关联的student
    std =local_school.student
    print('Hello,%s (in %s)' %(std,threading.current_thread().name))


def process_thread(name):
    #绑定ThreLocal的student变量
    local_school.student=name
    process_student()

t1= threading.Thread(target=process_thread,args=('li',),name='Thread-1')
t2=threading.Thread(target=process_thread,args=('cheng',),name='Thread-2')
t1.start()
t2.start()
t1.join()
t2.join()

可以这样理解，local_school是一个ThreaLocal对象（类似于一个dict），是一个全局变量，但local_school的每个属性local_school.student都是线程的局部变量，可以任意读写，线程之间互不干扰，不用管理锁的问题。
```
## 进程 vs. 线程
多任务情况下，通常是 **Master-Worker** 模式， Master负责分配任务，Worker负责执行任务，通常只有一个Master，多个Worker。

- 主进程是Master，其他进程是Worker（**多进程** 实现该模式），稳定性高，代价大
- 主线程是Master，其他线程是Worker（**多线程** 实现该模式），效率高，不稳定

### 计算密集型 vs. IO密集型
任务的类型分为这两类：

- 计算密集型：需要进行大量的计算，任务同时进行的数量应当等于CPU的核心数，需要高效率的代码，一般使用C
- IO密集型：CPU消耗少，涉及网络、磁盘IO的任务，最合适的语言是脚本语言，如Python

### 异步IO
充分利用OS的异步IO支持，可以实现单进程单线程模型执行多任务，被称为事件驱动模型，Python中，单线程的异步编程模型称为 **协程**。

## 分布式进程（Distributed Process）

Process可以分布到多台机器中，而Thread只能分布在同一台机器的多个CPU中
在Python中的`multiprocessing`模块的子模块`managers`支持把多进程分布到多台机器上。

```python
# task_master.py
import random, time, queue
from multiprocessing.managers import BaseManager

task_queue=queue.Queue() #发送任务的队列
result_queue=queue.Queue() #接收结果的队列

class QueueManager(BaseManager):
	pass

#将两个队列注册到网络上，callable关联Queue的对象
QueueManager.register('get_task_queue',callable=lambda:task_queue)
QueueManager.register('get_result_queue',callable=lambda:result_queue)

#绑定端口5000，设置验证码‘key’
manager=QueueManager(address=('',5000),authkey=b'key')
#启动Queue
manager.start()

#通过网络访问Queue对象，获得两个对象，这两个Queue对象是在网络中共享的
task=manager.get_task_queue()
result=manager.get_result_queue()

# 分配任务到task
for i in range(10):
	n=random.randint(0,10000)
	print('Put task %d...' %n)
	task.put(n) #将任务写入task的Queue
print('Try get result...')
# 从result队列中获取结果
for i in range(10):
	r = result.get(timeout=100) #从result中获取到相应结果
	print('Result: %s' %r)
# 关闭任务
manager.shutdown()
print('master exit.')

#task_worker.py
import time, sys, queue
from multiprocessing.managers import BaseManager

class QueueManager(BaseManager):
	pass

# QueueManager从网络上获取Queue，也就是master在网络上注册的队列
QueueManager.register('get_task_queue')
QueueManager.register('get_result_queue')
#连接服务器，是运行Master机器的IP地址
server_adr = '172.16.120.70'
print('Connect to server %s...' %server_adr)
#端口和验证码和master一致
m=QueueManager(address=(server_adr,5000),authkey=b'key')
m.connect() #连接该Queue

#获取到网络中共享的Queue对象
task =m.get_task_queue()
result=m.get_result_queue()

for i in range(10):
	try:
		n=task.get(timeout=100) #从Queue中获取数据，也就是获取任务
		print('run task %d*%d...'%(n,n))
		r='%d*%d=%d' %(n,n,n*n) #进行处理
		result.put(r) #将结果写入result的Queue

	except Queue.Empty:
		print('task queue is empty.')

print('worker exit')

结果如下（依次运行master和worker）：
[root@localhost Python]# python task_master.py
Put task 2510...
Put task 4137...
Put task 4813...
Put task 8463...
Put task 8600...
Put task 2369...
Put task 3680...
Put task 1531...
Put task 4798...
Put task 1694...
Try get result...
Result: 2510*2510=6300100
Result: 4137*4137=17114769
Result: 4813*4813=23164969
Result: 8463*8463=71622369
Result: 8600*8600=73960000
Result: 2369*2369=5612161
Result: 3680*3680=13542400
Result: 1531*1531=2343961
Result: 4798*4798=23020804
Result: 1694*1694=2869636
master exit.

[root@localhost Python]# python task_worker.py
Connect to server 172.16.120.70...
run task 2510*2510...
run task 4137*4137...
run task 4813*4813...
run task 8463*8463...
run task 8600*8600...
run task 2369*2369...
run task 3680*3680...
run task 1531*1531...
run task 4798*4798...
run task 1694*1694...
worker exit

```

# Reference
[liaoxuefeng的博客](https://www.liaoxuefeng.com/wiki/0014316089557264a6b348958f449949df42a6d3a2e542c000/0014319272686365ec7ceaeca33428c914edf8f70cca383000)
