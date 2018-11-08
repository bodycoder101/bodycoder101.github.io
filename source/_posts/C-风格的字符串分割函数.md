---
title: C++风格的字符串分割函数
copyright: true
date: 2018-10-21 18:42:30
categories: 编程语言
tags:
    - CPP
    - 字符串分割（StringSplit）
---
刷题或者在线编程考试的时候需要对输入的字符串进行分割，封装后再进行处理；
这里给出了一个通用的C++风格的字符串分割函数，适用不同的分割符。
<!--more-->

# 函数主体
**前提说明：** 输入的字符串string中包含string 或者 int再加分割符。
```cpp
#include <iostream>
#include <sstream>
#include <string>
#include <vector>
//使用说明，res默认存储的是int 类型，可根据实际情况修改存储类型
void splitString(const string& string, vector<int>& res, const char flag = ' ') {
    res.clear();
    istringstream iss(s);
    string token="";
    while (std::getline(iss, token, flag)) {
        res.push_back(std::stoi(token));
    }
    return;
}

```
# stringstream类
`<sstream>`库定义了三种类：`istringstream、ostringstream和stringstream`，分别用来进行流的输入、输出和输入输出操作。
1. `stringstream::str(); returns a string object with a copy of the current contents of the stream.`
2. `stringstream::str (const string& s); sets s as the contents of the stream, discarding any previous contents.`
3. `stringstream清空，stringstream s; s.str("");`
4. 实现任意类型的转换的模板

```cpp
        template<typename out_type, typename in_value>
        out_type convert(const in_value & t){
　　　　　　stringstream stream;
　　　　　　stream<<t;//向流中传值
　　　　　　out_type result;//这里存储转换结果
　　　　　　stream>>result;//向result中写入值
　　　　　　return result;
　　　　}
```

# getline()函数
```cpp
(1)	istream& getline (istream& is, string& str, char delim);
(2)	istream& getline (istream& is, string& str);
```
官方解释：
- extracts characters from is and stores them into str until the delimitation character delim is found (or the newline character, '\n', for (2)).

- The extraction also stops if the end of file is reached in is or if some other error occurs during the input operation.

- If the delimiter is found, it is extracted and discarded (i.e. it is not stored and the next input operation will begin after it).

- Note that any content in str before the call is replaced by the newly extracted sequence.

- Each extracted character is appended to the string as if its member push_back was called.

大意为：
对于(1),输入流is按分割符delim分割 **对于(2),输入流is遇到回车换行（'\n'）分割）**;
分割段转换为string存入str，下一次调用，str的内容会被下一个分割段替换。

# References
- [getline的官方解释](http://www.cplusplus.com/reference/string/string/getline/)
- [getline的几点疑惑](https://blog.csdn.net/u013660169/article/details/41726973)
- [c++如何分割带有逗号的字符串](https://blog.csdn.net/u013024710/article/details/50514396)
