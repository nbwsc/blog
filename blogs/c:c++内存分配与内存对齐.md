#c/c++内存分配与内存对齐全面探讨


这是2014年夏天写的笔记，在笔记里还算完整，虽然现在不怎么写C C++但是还是有点点回顾的意义的。当时内存分配对齐好久没弄通，跟另一名coder讨论试验了大半天才有点头绪。

```
/*the pro is to test the size of different classes in different OS
*
*
*@wsc
*/
#include<iostream>
#include<iomanip>
using namespace std;
class A {};//size =1
class B :A{};//size =1
class C{//size=4
 int a ;
};
class D{//size = 8
 double a;
};
class E{//size = 1
 char a;
};
class F{//size =20
 int a[5];
};
class G{//size =4
public:
 int a ;
};
class H{//size = 4
private:
 int a ;
};
class I:H{//size = 8
private :
 int a;
};
class J{//size = 1
 void test();
};
class K{//size =1
 int test();
};
class L{//size =1
 void test(int *p){
 }
};
class M{//size =1
 int test(int a){
  return 1;
 }
};
class N{//size = 64:8 32:4
 int* p;
};
class O{//size = 64:8 32:4
 virtual void tst(){
 }
};//虚函数：类里只是存了一个指针指向类外的virtual table，所以是一个指针的大小。
//如果有多个虚函数也是这个结果
class P{//size = 64:8 32:4
 virtual int test(){
  return 1;
 }
};
class Q:public A,public P{//size = 64:8 32:4
 virtual int test(){
  return 2;
 }
};
class R{//size = 1 
 static int a ;
};//static 变量其实是全局性质的，相当于全局变量R::a。所以并没有存在类里。
class S{//size =1
 S();
};
class T{//size =1
 ~T(){};
};
//-------------------------
class U{//size =24
public:
 int a ;//4	atc:4
 char b;//1	2
 short c ;//2	2
 double d;//8	8
 float e;//4	8
};
class V{//size = 24
public:
 int a;	//	4
 char b;	//	2
 short c;//	2
 float e;	//	8
 double d;	//	16
};
class W{//32
 public://	4
 char b;//	4
 int a ;//	8
 float e;//	8
 double d;//	8
 short c;//	8
};
class X{//32
public:
 float e;//	4
 short c;//	4
 int a ;//	8
 double d;//	8
 char b;//	8
};
class Y{//24
public:
 char a ;//	2
 short b;//	2
 int c;//	4
 float d;//	8
 double e;//	8
};
class Z{//24
 public:
 double e;	//	8
 float d;//	4
 int c;//	4
 short b ;//	2
 char a;//	6
};
/*
 class:U-Z
 win32:
 24 int:4 char:2 short:2 double:8 float:8	//rule 3
 addr of U:0021FA84 0021FA88 0021FA8A 0021FA8C 0021FA94
 24 int:4 char:2 short:2 float:8 double:8	//rule 2
 addr of V:0021FA64 0021FA68 0021FA6A 0021FA6C 0021FA74
 32 char:4 int:4 float:8 double:8 short:8
 addr of W:0021FA3C 0021FA40 0021FA44 0021FA4C 0021FA54
 32 float4 short:4 int:8 double:8 char:8
 addr of X:0021FA14 0021FA18 0021FA1C 0021FA24 0021FA2C
 24 char:2 short:2 int:4 float:8 double:8
 addr of Y:0021F9F4 0021F9F6 0021F9F8 0021F9FC 0021FA04
 24 double:8 float:4 int:4 short:2 char:6
 addr of Z:0021F9D4 0021F9DC 0021F9E0 0021F9E4 0021F9E6
 win64:
  24int4	char:2	short:2	double:8	float:8
  24int4	char:2	short:2	float:8	double:8
  32 char:4	int4	float:8	double:8	short:8
  32 float4	short:4	int8	double:8	char:8
  24 char:2	short:2	int4	float:8	double:8
  24 double:8	float:4	int4	short:2	char:6
addr of U:0031FD40	0031FD44	0031FD46	0031FD48	0031FD50
addr of V:0031FD20	0031FD24	0031FD26	0031FD28	0031FD30
addr of W:0031FCF8	0031FCFC	0031FD00	0031FD08	0031FD10
addr of X:0031FCD0	0031FCD4	0031FCD8	0031FCE0	0031FCE8
addr of Y:0031FCB0	0031FCB2	0031FCB4	0031FCB8	0031FCC0
addr of Z:0031FC90	0031FC98	0031FC9C	0031FCA0	0031FCA2
 lin64:
 24int4 char:2 short:2 double:8 float:8
 24int4 char:2 short:2 float:8 double:8
 32 char:4int4 float:8 double:8 short:8
 32 float4 short:4int8 double:8 char:8
 24 char:2 short:2int4 float:8 double:8
 24 double:8 float:4int4 short:2 char:6
addr of U:0x7fff5bc88180 0x7fff5bc88184 0x7fff5bc88186	0x7fff5bc88188 0x7fff5bc88190
addr of V:0x7fff5bc88160 0x7fff5bc88164 0x7fff5bc88166	0x7fff5bc88168 0x7fff5bc88170
addr of W:0x7fff5bc88100 0x7fff5bc88104 0x7fff5bc88108 0x7fff5bc88110 0x7fff5bc88118
addr of X:0x7fff5bc880e0 0x7fff5bc880e4 0x7fff5bc880e8	0x7fff5bc880f0 0x7fff5bc880f8
addr of Y:0x7fff5bc88140 0x7fff5bc88142 0x7fff5bc88144	0x7fff5bc88148 0x7fff5bc88150
addr of Z:0x7fff5bc88120 0x7fff5bc88128 0x7fff5bc8812c	0x7fff5bc88130 0x7fff5bc88132
 lin32:
 20int4 char:2 short:2 double:8 float:4
 20int4 char:2 short:2 float:4 double:8
 24 char:4int4 float:4 double:8 short:4//rule1
 24 float4 short:4int4 double:8 char:4
 20 char:2 short:2int4 float:4 double:8
 20 double:8 float:4int4 short:2 char:2
addr of U:0xbff60b1c	0xbff60b20	0xbff60b22	0xbff60b24	0xbff60b2c
addr of V:0xbff60b08	0xbff60b0c	0xbff60b0e 0xbff60b10	0xbff60b14
addr of W:0xbff60af0	0xbff60af4 0xbff60af8 0xbff60afc	0xbff60b04
addr of X:0xbff60ad8	0xbff60adc 0xbff60ae0 0xbff60ae4	0xbff60aec
addr of Y:0xbff60ac4 0xbff60ac6	0xbff60ac8 0xbff60acc	0xbff60ad0
addr of Z:0xbff60ab0	0xbff60ab8 0xbff60abc	0xbff60ac0	0xbff60ac2

```


 conclusion:
 rule1(地址对齐规则) :每个元素地址应该是min(数据总线长度,元素长度)的整数倍；64位OS数据总线为8,32位地址总线为4.；
 rule2:每个元素之前的所有元素大小和应是该元素所占大小的整数倍；
 rule3:每个结构体所占大小应该是该类的最大元素所占大小的整数倍。
rule 4:每个结构体所占大小应该是min(总线长度，最大元素长度)的整数倍；
 linux有rule1和rule4；win有rule1-3；
 ```
*/
int main(){
 cout<<sizeof(A)<<endl;
 cout<<sizeof(B)<<endl;
 cout<<sizeof(C)<<endl;
 cout<<sizeof(D)<<endl;
 cout<<sizeof(E)<<endl;
 cout<<sizeof(F)<<endl;
 cout<<sizeof(G)<<endl;
 cout<<sizeof(H)<<endl;
 cout<<sizeof(I)<<endl;
 cout<<sizeof(J)<<endl;
 cout<<sizeof(K)<<endl;
 cout<<sizeof(L)<<endl;
 cout<<sizeof(M)<<endl;
 cout<<sizeof(N)<<endl;
 cout<<sizeof(O)<<endl;
 cout<<sizeof(P)<<endl;
 cout<<sizeof(Q	)<<endl;
 cout<<sizeof(R)<<endl;
 cout<<sizeof(S)<<endl;
 cout<<sizeof(T)<<endl;
 U u ;
 cout<<sizeof(U)<<"int:"<<(long long )(&u.b)-(long long)(&u)<<" char:"<<(long long)(&u.c)-(long long )(&u.b)<<
  " short:"<<(long long)(&u.d)-(long long )(&u.c)<<" double:"<<(long long )(&u.e)-(long long)(&u.d)<<
  " float:"<<sizeof(U)-(long long )(&u.e)+(long long)(&u)<<endl;
 V v;
 cout <<sizeof(V)<<"int:"<<(long long )(&v.b)-(long long)(&v)<<" char:"<<(long long)(&v.c)-(long long )(&v.b)<<
  " short:"<<(long long)(&v.e)-(long long )(&v.c)<<" float:"<<(long long )(&v.d)-(long long)(&v.e)<<
  " double:"<<sizeof(V)-(long long )(&v.d)+(long long)(&v)<<endl;
W w;
cout <<sizeof(W)<<" char:"<<(long long )(&w.a)-(long long)(&w)<<"int:"<<(long long)(&w.e)-(long long )(&w.a)<<
" float:"<<(long long)(&w.d)-(long long )(&w.e)<<" double:"<<(long long )(&w.c)-(long long)(&w.d)<<
" short:"<<sizeof(W)-(long long )(&w.c)+(long long)(&w)<<endl;
 X x;
 cout<<sizeof(X)<<" float"<<(long long )(&x.c)-(long long)(&x)<<" short:"<<(long long)(&x.a)-(long long )(&x.c)<<
  "int:"<<(long long)(&x.d)-(long long )(&x.a)<<" double:"<<(long long )(&x.b)-(long long)(&x.d)<<
  " char:"<<sizeof(X)-(long long )(&x.b)+(long long)(&x)<<endl;
 Y y;
 cout<<sizeof(Y)<<" char:"<<(long long )(&y.b)-(long long)(&y)<<" short:"<<(long long)(&y.c)-(long long )(&y.b)<<
  "int:"<<(long long)(&y.d)-(long long )(&y.c)<<" float:"<<(long long )(&y.e)-(long long)(&y.d)<<
  " double:"<<sizeof(Y)-(long long )(&y.e)+(long long)(&y)<<endl;
 Z z;
 cout<<sizeof(Z)<<" double:"<<(long long )(&z.d)-(long long)(&z)<<" float:"<<(long long)(&z.c)-(long long )(&z.d)<<
  "int:"<<(long long)(&z.b)-(long long )(&z.c)<<" short:"<<(long long )(&z.a)-(long long)(&z.b)<<
  " char:"<<sizeof(Z)-(long long )(&z.a)+(long long)(&z)<<endl;
 cout<<"addr of U:"<<(void*)&u.a<<"\t"<<(void*)&u.b<<"\t"<<(void*)&u.c<<"\t"<<(void*)&u.d<<"\t"<<(void*)&u.e<<endl;
 cout<<"addr of V:"<<(void*)&v.a<<"\t"<<(void*)&v.b<<"\t"<<(void*)&v.c<<"\t"<<(void*)&v.e<<"\t"<<(void*)&v.d<<endl;
 cout<<"addr of W:"<<(void*)&w.b<<"\t"<<(void*)&w.a<<"\t"<<(void*)&w.e<<"\t"<<(void*)&w.d<<"\t"<<(void*)&w.c<<endl;
 cout<<"addr of X:"<<(void*)&x.e<<"\t"<<(void*)&x.c<<"\t"<<(void*)&x.a<<"\t"<<(void*)&x.d<<"\t"<<(void*)&x.b<<endl;
 cout<<"addr of Y:"<<(void*)&y.a<<"\t"<<(void*)&y.b<<"\t"<<(void*)&y.c<<"\t"<<(void*)&y.d<<"\t"<<(void*)&y.e<<endl;
 cout<<"addr of Z:"<<(void*)&z.e<<"\t"<<(void*)&z.d<<"\t"<<(void*)&z.c<<"\t"<<(void*)&z.b<<"\t"<<(void*)&z.a<<endl;
 return 0; 
}
```