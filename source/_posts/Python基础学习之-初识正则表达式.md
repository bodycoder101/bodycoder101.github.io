---
title: 'Python基础学习之[初识正则表达式]'
copyright: true
date: 2017-07-16 15:52:06
categories: Python
tags:
- Python
- Programming language
---
# 正则表达式(Regrelar Expression)

正则表达式是一种描述性的语言表达，本身是字符串；它是给字符串定义一个规则，凡是符合规则的字符串，认为它“匹配了”，否则就是匹配失败，被任务是不合法的，常见的有Email格式，密码格式的匹配等，

<!--more-->

例如：
- \d{n,m} 表示匹配n~m个数字
- \w 表示匹配一个字母或者数字
- . 表示匹配任意字符，如`py.`可以匹配到`pyo`, `py!`等
- \s 表示可以匹配一个空格
- ^ 表示行的开头，`^\d`表示必须以数字开头
- $ 表示行的结束，`\d$`表示必须以数字结束
- \+ 表示贪婪匹配，可以多个匹配`\s+`表示匹配多个连续的空格
- \* 表示连续匹配，或者叫通配符，例如：`0*`表示可以将000,00000等匹配出来

需要注意的是，下划线`_`或者横杠`-` 需要用转义字符`\_ \-`。

Python中提供内建模块`re`,代表: **regular expression** 正则表达式。

## re模块
在Python中要用到正则表达式时，建议要再匹配的字符串前加上`r`前缀，表示告诉编译器这个String(也就是写的正则表达式)是Raw String，在字符串中含有的特殊字符不需要转义，原样输出.例如：r`ABC\n001\-234`

- match() 方法

```python
import re
test = '010-123456'
if re.match(r'^\d{3}\-\d{3, 8}$',test): #该方法匹配成功返回的是mathch的对象，这里返回的是test对象
    print('match success!')
else:
    print('match failed!')
```

- spilt() 方法切分字符串，可以结合正则表达式使用

```python
# 正则表达式表达的是匹配规则，也就是匹配了按该匹配的符号进行分割。
>>> re.split(r'[\s\,\;]+','abcd;;s;c,k h') #第一个参数是表示以什么分割符进行分割，第二个参数表示的是待分割的字符串
['abcd', 's', 'c', 'k', 'h']
```
- 分组提取（基于match方法）
`()`表示的是就是要提取的分组（Group）

```python
>>> k=re.match(r'^(\d{3})-(\d{3,8})$','010-12345678') #注意-不需要斜杠转义了
>>> k
<_sre.SRE_Match object; span=(0, 12), match='010-12345678'>
>>> k.group(0) #group(0)表示的是原始字符串，后面的group(1),group(2)表示的是第1、2子串。   
'010-12345678'
>>> k.group(1)   
'010'
>>> k.group(2)
'12345678'
>>>
```
## 编译（compile）
在Python脚本中使用正则表达式，re模块内部会干两件事情：
1. 编译正则表达式，如果正则表达式本身不合法，会报错；
2. 用编译后的正则表达式去匹配字符串。

```python
>>> import re
>>> re_phone=re.compile(r'^(\d{3})-(\d{3,8})$') #编译
>>> re_phone.match('010-12345678').groups() #使用，匹配
('010', '12345678')
```
# Reference
[liaoxuefeng的博客](https://www.liaoxuefeng.com/wiki/0014316089557264a6b348958f449949df42a6d3a2e542c000/00143193331387014ccd1040c814dee8b2164bb4f064cff000)
