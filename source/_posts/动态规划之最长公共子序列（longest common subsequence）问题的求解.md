---
title: >-
  动态规划之最长公共子序列（longest common subsequence）问题的求解
date: 2017-04-30 16:57:23
categories: Algorithms
tags: Dynamic Programming
copyright: true
---

从 二月中旬到四月底 这段时间一直忙于找实习，做准备，刷题，牛客上刷了蛮多算法题，遇到过比较多用动态规划解的题，现在实习的事情基本上也已经定下来了，手上也收到几个还满意的offer，一直想找一个时间去总结下此类题目的解法，思路总是有点模糊，容易忘记，现乘着有时间正好总结一下，也方便后面查阅。动态规划最经典的题目莫过于求两个字符串的最长公共子序列（LCS）问题了，我就以这个问题为例子，总结下动态规划的特点及适用场景。

<!-- more -->

# 问题描述
给定两个字符串（母串）：
- ABCBDAB
- BDCABA
所谓的公共子序列（可以不连续出现）指的是在两个母串都出现过且顺序和母串保持一致，如： **AB**CBD **A**B 与 BDC**ABA**，公共子序列为ABA。最长公共子序列（LCS）也就是公共子序列中长度最长的那个。而子串是加了更严格条件的子序列，要求在两个母串中连续出现，如：ABC**BD**AB 与 **BD**CABA，BD是公共子串。两个母串的最长公共子序列为 **BCBA** ,最长公共子串为 **AB**。

对于 **母串**：
X={X1,X2,X3,...,Xm}
Y={y1,y2,y3,yn}
求最长公共子序列和最长公共子串。

# 最长公共子序列（LCS）
## 问题分析
假设Z={z1,z2,z3,....,zk}是 *X* 与 *Y* 的最长公共子序列（LCS），则有（**从后往前分析**）：
数组 **LCS[i,j]** 保存的是最长公共子序列的 **长度**

1. 若X(m)=Y(n), 则有：
- Z(k)=X(m)=Y(n),则Z(k-1)是X(m-1)和Y(n-1)的LCS
- LCS(m,n)=LCS(m-1,n-1)+1

2. 若X(m)!=Y(n)，则有：
- 若最终Z(k)!=X(m)，则 LCS(m,n)= LCS(m-1,n)
- 若最终Z(k)!=Y(n),则 LCS(m,n)= LCS(m,n-1)
- LCS(m,n)=Max{LCS(m-1,n), LCS(m,n-1)}

由于子问题具有 **高度重叠性（见下图）**，可以用二维数组LCS[m][n]保存中间状态，为以后重复利用，用 **空间换时间**，这也是动态规划的核心思想。

![](https://raw.githubusercontent.com/bodycoder101/MarkdownPhotos/master/%E5%AD%90%E9%97%AE%E9%A2%98%E5%85%B7%E6%9C%89%E7%9A%84%E9%87%8D%E5%8F%A0%E6%80%A7.png)

## 问题求解
使用动态规划求解，LCS的 **状态转移方程** 为：
- LCS[i,j]=0                           if i=0 or j=0
- LCS[i,j]=LCS[i-1, j-1] + 1           if i, j>0, and xi=yj
- LCS[i,j]=Max(LCS[i,j-1],LCS[i-1,j])  if i,j>0, and xi!=yj

## 伪代码描述
```c++
for i=0 to m do LCS[i,0]←0
for j=1 to n do LCS[0,j]←0 //也就是将数组第一行和第一列初始化为0
for i=1 to m do
     for j=1 to n do
          if X[i]=Y[j] then
               LCS[i,j] = LCS[i-1,j-1]+1;
               b[i,j] = “↖” ; //设置了标志位，利用该标志位，打印出最长公共子序列
          else if LCS[i-1,j]≥C[i,j-1] then
               LCS[i,j] = LCS[i-1,j]；
               b[i,j] = “↑” ;
          else
               LCS[i,j] = LCS[i,j-1]；
               b[i,j] = “←” ;

  return LCS and b             
```

## 回溯求出最长公共子序列的过程
![](https://raw.githubusercontent.com/bodycoder101/MarkdownPhotos/master/%E5%85%AC%E5%85%B1%E5%AD%90%E5%BA%8F%E5%88%97%E5%9B%9E%E6%BA%AF%E8%BF%87%E7%A8%8B.png)

## 参考实现代码

```c++
void LCSLength(int m,int n,char *x,char *y,int **LCS,int **b)  
{  
    int i,j;  

    for(i=1; i<=m; i++)  
        LCS[i][0] = 0;  //将数组的第一行置为0
    for(i=1; i<=n; i++)  
        LCS[0][i] = 0; //将数组的第一列置为0

    for(i=1; i<=m; i++)  //按行的顺序分别求出LCS中各元素的值并保存
    {  
        for(j=1; j<=n; j++)  
        {  
            if(x[i]==y[j])  
            {  
                LCS[i][j]=LCS[i-1][j-1]+1;  
                b[i][j]=1;  
            }  
            else if(c[i-1][j]>=c[i][j-1])  
            {  
                LCS[i][j]=LCS[i-1][j];  
                b[i][j]=2;  
            }  
            else  
            {  
                 LCS[i][j]=LCS[i][j-1];  
                 b[i][j]=3;  
            }  
        }  
    }  
}  

void LCS(int i,int j,char *x,int **b)  //自底向上求解（回溯），递归得到最长公共子序列
{  
    if(i==0 || j==0)  
    {  
        return;  
    }  
    if(b[i][j]==1)  
    {  
        LCS(i-1,j-1,x,b);  
        cout<<x[i]<<" ";  
    }  
    else if(b[i][j]==2)  
    {  
        LCS(i-1,j,x,b);  
    }  
    else  
    {  
        LCS(i,j-1,x,b);  
    }  
}  
int main(int argc, char **argv)
{
    char x[10] = {"ABCBDAB"};
    char y[10] = {"BDCABA"};
    int b[10][10];
    int LCS[10][10];
    int m, n;

    m = strlen(x);
    n = strlen(y);

    LCSLength(m, n, x, y, LCS, b); //也就是LCS[m][n]的值为最大长度
    std::cout << "LCS length is:" << LCS[m][n]<<'\n';

    std::cout << "LCS:" << '\n';
    LCS(m, n, b, x,);
    return 0;
}
```

## 算法分析
由于每次调用至少 **向上或向左或斜向上** 移动一步，故最多调用(m + n)次就会遇到i = 0或j = 0的情况，此时开始返回。
返回时与递归调用时方向相反，步数相同，故算法时间复杂度为 **Θ(m + n)**。

# 动态规划题型总结
使用动态规划解题需满足的条件：
- 问题可分为多个相关子问题
- 问题的最优解包含子问题的最优解，问题具有 **最优子结构**
- 子问题的解被重复利用（子问题的高度重叠性），**将子问题的解保存在表中（一般是二维数组）**，以后用到时直接存取，这是一种空间换时间的做法，也是DP的核心思想。

# 参考博客
- [最长公共子序列与最长公共子串](http://www.cnblogs.com/en-heng/p/3963803.html)
- [最长公共子序列问题(LCS)](http://blog.csdn.net/liufeng_king/article/details/8500084)
- [动态规划解最长公共子序列问题](http://blog.csdn.net/yysdsyl/article/details/4226630/)
