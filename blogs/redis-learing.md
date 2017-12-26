# redis

## 数据类型
*　String	SET/GET

* Hash		HMSET/HGETALL					hash特别适合用于存储对象

* List		LPUSH/LRANGE list start end 	

* Set 		SADD/SMEMBERS					集合是通过哈希表实现的，所以添加，删除，查找的复杂度都是O(1)。

* Zset(sorted set)	ZADD/ZRANGEDBYSCORE