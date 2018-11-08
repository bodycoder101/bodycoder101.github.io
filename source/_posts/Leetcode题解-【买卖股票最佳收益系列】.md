---
title: 'Leetcode题解:【买卖股票最佳收益系列】'
copyright: true
date: 2018-11-06 15:59:36
categories: Leetcode题解
tags:
    - stock
    - maxProfit
---

leetcode中关于买卖股票最佳时机的题目有：

- [121.Best Time to Buy and Sell Stock](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/)
- [122.Best Time to Buy and Sell Stock 2](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/)
- [123.Best Time to Buy and Sell Stock 3](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/)
- [188.Best Time to Buy and Sell Stock 4](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/)
- [309.Best Time to Buy and Sell Stock with Cooldown](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/)
- [714.Best Time to Buy and Sell Stock with Transaction Fee](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/)

除了第122使用贪心法，其他题目可以使用动态规划解决。
<!--more-->

# 121.Best Time to Buy and Sell stock
**使用动态规划：** 只能买卖一次，求最大收益。
从前往后扫描，最大化第i天的收益即第i天的价格 - 第i天及之前的最低价格 **（可以当天买当天卖）**，因此可以使用一个数组minPrice记录第i天及之前的最低价格，maxProfit记录最大收益，即有状态转移方程：

- `minPrice[i]=min{minPrice[i-1], prices[i]}`
- `maxProfit=max{maxProfit, prices[i]-minPrice[i]}`

复杂度：
- 时间：o(n)
- 空间：o(n)

```cpp
class Solution {
public:
    int maxProfit(vector<int>& prices) {
        if(prices.size()<2){
            return 0;
        }
        vector<int> minPrice(prices.size());
        minPrice[0] = prices[0];
        int maxProfit = 0;
        for(int i =1;i<prices.size();++i){
            minPrice[i] = min(minPrice[i-1],prices[i]);
            maxProfit = max(maxProfit,prices[i]-minPrice[i]);
        }
        return maxProfit;
    }
};
```

# 122. Best Time to Buy and Sell Stock 2
**使用贪心法：** 可以交易多次，但每次只能买卖一只股票，手里只能有一手的股票，买之前必须将手里的股票卖出去。
从前往后扫描，只要当天的价格比前一天的价格高，就可以卖出去，获取收益，同时当天也可以买入。然后贪心累加即为结果。
复杂度：
- 时间：o(n)
- 空间：o(1)

```cpp
class Solution {
public:
    int maxProfit(vector<int>& prices) {
        if(prices.size()<2){
            return 0;
        }

        int maxProfit = 0;
        for(int i =1; i<prices.size(); ++i){
            int diff = prices[i] - prices[i-1];
            if(diff > 0){
                maxProfit += diff;
            }
        }
        return maxProfit;
    }
};
```
# 123. Best Time to Buy and Sell Stock 3
**使用动态规划:** 最多交易两次，求最大收益。
思路：使用二分法，将`prices[0...n]`分为`prices[0...i] and prices[i+1..n]`，对两部分使用题号为121的方法，求的最大值
然后，顺序扫描一遍，求的最大值。

方法一：直接复用题号为121的方法，迭代进行求解,会超时；
复杂度：
- 时间：o(n^2)
- 空间：o(n)
```cpp
class Solution {
public:
    int maxProfit(vector<int>& prices) {
        if (prices.size()<2) {
            return 0;
        }
        int maxProfit = 0;
        for (int i = 0; i < prices.size(); i++) {
            vector<int> firstPart(prices.begin(),prices.begin()+i);
            vector<int> secondPart(prices.begin()+i,prices.end());
            int first = maxProfitHelper(firstPart);//o(n^2)
            int second = maxProfitHelper(secondPart);//o(n^2))
            maxProfit = max(maxProfit, first+second);
        }
        return maxProfit;
    }
private:
    int maxProfitHelper(vector<int>& prices) {
        if(prices.size()<2){
            return 0;
        }
        int* minPrice = new int[prices.size()];
        minPrice[0] = prices[0];
        int maxProfit = 0;
        for(int i =1;i<prices.size();++i){
            minPrice[i] = min(minPrice[i-1],prices[i]);
            maxProfit = max(maxProfit,prices[i]-minPrice[i]);
        }
        delete[] minPrice;
        return maxProfit;
    }
};
```
方法二：对方法一进行改良，使用两个数组将第一部分和第二部分的收益保存到数组，然后依次遍历求结果
复杂度：
- 时间o(n);
- 空间o(n);


```cpp
class Solution {
public:
    int maxProfit(vector<int>& prices) {
        if (prices.size()<2) {
            return 0;
        }

        int len = prices.size();
        vector<int> first(len,0);
        vector<int> second(len,0);

        //从前往后扫描，第i天卖出
        int min_buy = prices[0];
        for (int i = 1; i < len; i++) {
            min_buy = min(min_buy, prices[i]);
            first[i] = max(first[i-1], prices[i]-min_buy);
        }

        //从后往前扫描，第i天买入
        int max_sold = prices[len-1];
        for (int i = len-2; i >= 0; i--) {
            max_sold = max(max_sold, prices[i]);
            second[i] = max(second[i+1], max_sold - prices[i]);
        }

        //从头到尾扫描，前后两部分相加。求出最大利润
        int maxProfit = 0;
        for (int i = 0; i < len; i++) {
            maxProfit = max(maxProfit, first[i] + second[i]);
        }

        return maxProfit;
    }
};
```
# 188. Best Time to Buy and Sell Stock 4
**使用动态规划法：** 与**题122**不同的是，股票**最多交易k次**，求最大收益。

使用 **局部最优和全局最优解法，**定义两个二维数组：

- local[i][j]: 表示当前到达第i天，最多可以进行j次交易，且最后一次交易(卖出)在当天卖出的局部最大利润
- global[i][j]: 表示当前到达第i天，最多可以进行j次交易的全局最大利润
- diff = prices[i] - prices[i-1]： 表示第i天与第i-1天的价格差
两者的区别是local[i][j]表明 ** 第i天一定有交易（卖出）发生，** 可以是第i-1天买入，第i天卖出，也可以是第i天买入，并在当天（第i天）卖出。

分析过程：
1. 局部最优 = max{情况1，情况2}
    - 情况1：第i-1天已经**恰好**交易j次`(local[i-1][j])`; 而第i天必须有交易（卖出）发生，那么如果第i-1天买入，第i天卖出，并"不会"增加交易次数【这里比较难理解，可以这样理解：第一天买入，第二天卖出，然后第二天又买入，第三天卖出的情形和第一天买入，第三天卖出的情形获利效果是一样的，因为没有交易费。】，因此`情况1 = local[i-1][j] + diff`
    - 情况2：在第i-1天**已经**交易了j-1次`global[i-1][j-1]`; 为了满足 **“第i天过后进行了j次交易，并且第i天必须有交易发生”** 的条件；我们可以选择两种方式：1)第i-1天买入，第i天卖出，收益为diff; 2)第i天买入，第i天卖出，收益为0。 因此`情形2 = global[i-1][j-1]+max{diff, 0}`


2. 全局最优 = max{情况1，情况2}； 全局最优`global[i][j]`表示的是第i天最多进行了j次交易的最大收益
    - 情况1：第i天过后恰好满足j次交易，也就是第i天一定有交易（卖出）发生，此时为局部最优，因此`情况1 = local[i][j]`
    - 情况2：第i-1天过后已经满足了j次交易，第i天没有没有交易（卖出）发生，因此为前一个的全局最优，`情况2 = global[i-1][j]`

因此可以得到的状态转移方程为：
- `local[i][j] = max{local[i-1][j] + diff, global[i-1][j-1]+max{diff,0}}`
- `global[i][j] = max{local[i][j], global[i-1][j]}`

注意：**当k>=days时，** 该情况退化成题122的情形，可以交易多次的情况。

因此我们想要的结果是:`global[days-1][k]` 表示的是最后一天结束后，交易k次的全局最大利润。

复杂度：
- 时间：o(n*k)
- 空间：o(n*k)

```cpp
class Solution {
public:
    int maxProfit(int k, vector<int>& prices) {
        if (prices.size()<2) {
            return 0;
        }

        int days = prices.size();
        if (k >= days) {
            return maxProfitHelper(prices);
        }
        //初始化二维数组都为0
        vector<vector<int>> local(days);
        vector<vector<int>> global(days);
        for (int i = 0; i < days; i++) {
            local[i].resize(k+1);
            global[i].resize(k+1);
        }

        //迭代计算
        for (int i = 1; i < days; i++) {
            int diff = prices[i] - prices[i-1];
            for (int j = 1; j <= k; j++) {
                local[i][j] = max(local[i-1][j] + diff, global[i-1][j-1] + max(diff,0));
                global[i][j] = max(local[i][j], global[i-1][j]);
            }
        }
        return global[days-1][k];
    }

private:
    int maxProfitHelper(vector<int>& prices) {
        if(prices.size()<2){
            return 0;
        }

        int maxProfit = 0;
        for(int i =1; i<prices.size(); ++i){
            int diff = prices[i] - prices[i-1];
            if(diff > 0){
                maxProfit += diff;
            }
        }
        return maxProfit;
    }
};
```
# 309.Best Time to Buy and Sell Stock with Cooldown
**使用动态规划：** 与122不同的是，这题限制了sell之后需要cooldown一天，然后才能buy，即操作为`[buy, sell, cooldown, buy, sell]`.
分析：
维护三个数组：
- buy[i]表示的是第i天及之前的最后一个操作为买，此时的最大利润
- sell[i]表示的是第i天及之前的最后一个动作为卖，此时的最大利润
- rest[i]表示的是第i天及之前的最后一个动作为cooldown或者没有任何动作，此时的最大利润

可以得到三个状态转移方程为：
- buy[i]=max{buy[i-1], rest[i-1]-prices[i]} 表示的是：1）第i天没有动作，和第i-1天一样, 都是持股的状态；2）第i天买入，转为持股状态
- sell[i]=max{sell[i-1], buy[i-1]+prices[i]} 表示的是：1）第i天没有动作，和第i-1天一样，都是未持股状态；2）第i-1天买入，第i天卖出，在第i天转为未持股状态
- rest[i]=max{sell[i-1], buy[i-1], rest[i-1]} 表示的是：过渡期的最大利润有三种状态

由于存在冷冻区，在rest的状态的最大利润可以表示为：`rest[i] = sell[i-1]` ;因此状态转移方程可以精简为：
- buy[i] = max{buy[i-1], sell[i-2]-prices[i]} 也就是说前天卖了股票，今天才能买
- sell[i] = max{sell[i-1], buy[i-1]+prices[i]}

因此我们想要的结果是:`maxProfit = sell[n-1]`表示的是最后一天结束后，未持股状态下的最大收益。
还有一种方法是使用**有限状态机**的方法，也很清晰，详见 **References 3。**

复杂度：
- 时间o(n)
- 空间o(n)

```cpp
class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int n = prices.size();
        if (n<2) {
            return 0;
        }
        vector<int> buy(n,0);
        vector<int> sell(n,0);

        //赋予初始值
        buy[0]= - prices[0];
        sell[0]=0;
        for (int i = 1; i < n; i++) {
            sell[i] = max(sell[i-1], buy[i-1]+prices[i]);
            if (i >= 2) {
                buy[i] = max(buy[i-1], sell[i-2]-prices[i]);
            }else{
                buy[i] = max(buy[i-1], -prices[i]);
            }
        }
        return sell[n-1];
    }
};
```
# 714.Best Time to Buy and Sell Stock with Transaction Fee
**使用动态规划：**与122题不同的是，加了限制条件，每次买卖有交易费，求最大的收益。
分析：账户状态只有两种情况，要么满仓持有股票，要么空仓不持股票；
维护两个变量数组：
- unhold[i]:表示第i天账户不持有股票，此时的最大收益。只有两种情况：1）与第i-1天一样，空仓不持有股票；2）第i-1天持有股票，第i天卖出股票，空仓。
- hold[i]:表示第i天持有股票，此时的最大利润。也只有两种情况：1）与第i-1天一样，满仓持有股票；2）第i-1天不持有股票，第i天买入股票，满仓。

因此有状态转移方程：
- unhold[i]=max{unhold[i-1], hold[i-1]+prices[i]-fee}
- hold[i]=max{hold[i-1], unhold[i-1]-prices[i]}

初始值为：
- unhold[0] = 0
- hold[0]= - prices[0]

因此我们想要的结果是：`unhold[n-1]`, 表示的是最后一天结束后不持有股票的最大收益。

复杂度：
- 时间o(n)
- 空间o(n)


```cpp
class Solution {
public:
    int maxProfit(vector<int>& prices, int fee) {
        int n = prices.size();
        if (n<2) {
            return 0;
        }
        vector<int> unhold(n,0);
        vector<int> hold(n,0);

        //赋予初始值
        unhold[0] = 0;
        hold[0] = -prices[0];

        for (int i = 1; i < n; i++) {
            unhold[i] = max(unhold[i-1], hold[i-1] + prices[i] - fee);
            hold[i] = max(hold[i-1], unhold[i-1] - prices[i]);
        }
        return unhold[n-1];
    }
};
```
# References
- [Leetcode动态规划](https://blog.csdn.net/dr_unknown/article/details/51939121)
- [Best Time to Buy and Sell Stock with Cooldown](https://blog.csdn.net/u013325815/article/details/52829802?locationNum=12&fps=1)
- [动态规划中五道股票买卖题目详解](https://segmentfault.com/a/1190000006672807)
