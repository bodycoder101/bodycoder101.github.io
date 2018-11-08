---
title: 二叉树遍历方法总结(C++实现)
copyright: true
date: 2018-10-20 15:06:17
categories: Algorithms
tags:
- Binary Tree
- Recursion
- 非递归方法
---

二叉树的遍历方法是解决很多有关树的问题的基础，对于标准的递归算法，基本上大家都能bug free写出来；
但对于非递归的方法，貌似总会有模糊的地方，共性都知道使用栈，但取栈顶，出栈位置是否会经常模糊？
前中后续递归方法很好理解，三种方法的表现形式完全统一，而非递归方法是用是辅助栈，但实现方法略有变化，
而造成了理解的模糊，本文给出了一种统一的表现形式，更助于理解及变通。

<!-- more -->

# 结点的定义
```cpp
struct TreeNode {
	int val;
	struct TreeNode *left;
	struct TreeNode *right;
	TreeNode(int x) :
			val(x), left(NULL), right(NULL) {
	}
};
```

# 前序遍历
遍历顺序为`根 -> 左 ->右`

```cpp
//先序递归
void PreOrder(TreeNode *poot, vector<int> &path){
	 if (root) {
	 	path.push_back(root->val);
		PreOrder(root->left,path);
		PreOrder(root->right,path);
	 }
}
//常规的非递归前序遍历
void preorderTraversalOld(TreeNode* root, vector<int> &path) {
	if (root == NULL) {
		return;
	}
	stack<TreeNode*> save;
	TreeNode* p = root;
	while (!save.empty() || p!=NULL) {
		while (p!=NULL) {
			path.push_back(p->val);
			save.push(p);
			p=p->left;
		}
		if (!save.empty()) {
			p = save.top();
			save.pop();
			p=p->right;
		}
	}
}
```

# 中序遍历
遍历顺序为`左 -> 根 ->右`

```cpp
//递归中序遍历
void InOrder(TreeNode* root, vector<int> &path){
	if (root!=NULL) {
		InOrder(root->left,path);
		path.push_back(root->val);
		InOrder(root->right,path);
	}
}

//常规的非递归中序遍历
void InOrderTraversalOld(TreeNode* root, vector<int> &path){
	if (root == NULL) {
		return;
	}
	stack<TreeNode*> save;
	TreeNode* p=root;
	while (p!=NULL || !save.empty()) {
		while (p!=NULL) {
			save.push(p);
			p=p->left;
		}
		if (!save.empty()) {
			p=save.top();
			save.pop();
			path.push_back(p->val);
			p=p->right;
		}
	}
}
```

# 后续遍历
遍历顺序为`左 -> 右 ->根`

```cpp
//递归后续遍历
void PostOrder(TreeNode* root, vector<int> &path){
	if (root!=NULL) {
		PostOrder(root->left,path);
		PostOrder(root->right,path);
		path.push_back(root->val);
	}
}

//常规的非递归后续遍历
void PostOrderTraversalOld(TreeNode *root, vector<int> &path){
	if (root==NULL) {
		return;
	}
	stack<TreeNode*> save;
	save.push(root);
	TreeNode* p = root ->left;
	TreeNode* preNode = NULL;
	while (!save.empty()) {
		while (p!=NULL && p!=preNode) {
			save.push(p);
			p=p->left;
		}
		p = save.top();
		if(p->right && p->right!=preNode) {
			p=p->right;
		}else{
			path.push_back(p->val);
			preNode = p;
			save.pop();
		}
	}
}
```

# 三种非递归遍历方法的总结
毋庸置疑，都使用了辅助栈；不同的是入栈、取栈顶元素和出栈的位置不同

- 三种方法的第一步均是，找到最左下角的元素，过程中遍历的元素依次入栈；
- 前序是在第一步遍历过程中的路径记录下来，存入path，中序是第一步扫描结束后，依次返回存入path；
- 后序需要带有记忆性的扫描，新建preNode，记录已经存入path的节点位置

从前面总结可以看出，除了前序和中序的代码风格类似，但后序遍历有较大的区别，而且嵌套多层循环，实际理解起来
干看并不是特别容易；即使理解了，隔一段时间写起来并不是特别顺畅，还需要各种推敲。
因此思考一个这样的问题：**有没一种方法，可以统一这三种遍历方法的表达方式呢？**
网上搜寻了一些答案，发现这位兄台的解释及方法可以完全解决上述问题。
当个搬运工：[子松的简书博客](https://www.jianshu.com/p/49c8cfd07410)

# 更简单的方法统一的三种非递归遍历二叉树的方式
这种方法做到了将**算法与顺序分离**，定义何种顺序并不影响算法；
算法只做这么一件事：**将栈顶元素取出，使以此元素为“根”结点的局部有序入栈，但若此前已通过该结点将其局部入栈，则直接出栈输出即可。**

```cpp
void orderTraversalNew(TreeNode *root, vector<int> &path){
	if (root == NULL) {
		return;
	}

	stack< pair<TreeNode *, bool> > s;
    s.push(make_pair(root, false));
    bool visited;
    while(!s.empty()){
        root = s.top().first;
        visited = s.top().second;
        s.pop();
        if(root == NULL)
            continue;

        if(visited){
            path.push_back(root->val);
        }else{
			//只需调整下列语句的先后顺序即可完成前中后的遍历
			//前序
            s.push(make_pair(root->right, false));
            s.push(make_pair(root->left, false));
            s.push(make_pair(root, true));

			/*
			//中序
			s.push(make_pair(root-right,false));
			s.push(make_pair(root,true));
			s.push(make_pair(root->left,false));
			//后续
			s.push(make_pair(root,true));
			s.push(make_pair(root->right, false));
            s.push(make_pair(root->left, false));
			*/

        	}
    }
}
```

这种代码刚看到的时候，真是感觉牛逼啊！
主要思想为：**有重合元素的局部有序一定能导致整体有序！**。

# 层次遍历
二叉树的层次遍历也是一个常常应用的遍历方法，如求树的宽度就可以用到层次遍历；
中心思想是用一个**队列**保存左右孩子节点，然后依次出队列，存入path中；完成层次遍历。

```cpp
//层次遍历,使用一个队列保存层次节点
void LevelOrder(TreeNode* root,vector<int> &path){
	if (root == NULL) {
		return;
	}
	queue<TreeNode*> save;
	save.push(root);
	while (!save.empty()) {
		TreeNode* p = save.front();
		path.push_back(p->val);
		//左节点不空，入队
		if (p->left) {
			save.push(p->left);
		}
		//右节点不空，入队
		if (p->right) {
			save.push(p->right);
		}
		//根节点出队
		p.pop();
	}

}
```

# References
- [更简单的非递归遍历二叉树的方法](https://www.jianshu.com/p/49c8cfd07410)
- [人脑理解递归](https://www.jianshu.com/p/4db970d8ddc1)
- [c++实现二叉树的递归和非递归遍历](https://blog.csdn.net/xuzhangze/article/details/78696080)
