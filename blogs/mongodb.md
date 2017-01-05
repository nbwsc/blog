# some mongo operation

* return length of documents 
```
find({?}).count()
```

* query some item's lenth in your condition
```
db.accommodations.find({ name : { $size: { $gt : 1 } }})

db.accommodations.find( { $where: "this.name.length > 1" } );

db.accommodations.find({"NamesArrayLength": {$gt: 1} });

{$nor: [
    {name: {$exists: false}},
    {name: {$size: 0}},
    {name: {$size: 1}}
]}
```

* custom query
```
db.things.find({$where: function() {
    for (var key in this) {
        if (this[key] === "bar") {
            return true;
        }
        return false;
    }
});
```

 [Mongo]分组统计时间 aggregate，group，distinct
 开发中有些按日期记录的记录需要各种维度的统计，按天，按月，按年，按小时，。。分组统计，还有些需要对字段去重统计，在之前的 [Mongo] 按时间分组统计（group时间格式化）  中用group实现了按天的统计，不过使用new Date（）方法会有些坑，今天看了下aggregate中，使用聚合来写个时间统计。
tips: aggregate 挺复杂，弄明白了再做笔记，现在只是根据需求来查询。
数据结构还是：

[javascript] view plain copy print?
/* 0 */  
{  
  "_id" : ObjectId("541fcc51c6c36038bc6b81cd"),  
  "url" : "http://wifi21.com/",  
  "addtime" : ISODate("2014-08-19T00:15:02Z")  
}  
  
/* 1 */  
{  
  "_id" : ObjectId("541fcc51c6c36038bc6b81ce"),  
  "url" : "http://meiwen.me/src/index.html",  
  "addtime" : ISODate("2014-08-19T00:15:07Z")  
}  
...  



按月统计pv值（相当于group）
[javascript] view plain copy print?
db.msds_accessrecord.aggregate([  
    {$group: {  
        _id: {  
            "$month": "$addtime"  
        },   
     pv: {$sum: 1}}  
    },  
    {$sort: {"_id": 1}}  
]);  
统计结果
[javascript] view plain copy print?
/* 0 */  
{  
    "result" : [   
        {  
            "_id" : 8,  
            "pv" : 583  
        },   
        {  
            "_id" : 9,  
            "pv" : 1399  
        }  
    ],  
    "ok" : 1  
}  



按月统计url值，重复url去掉，这里只是做个演示，可能统计没什么意义 （相当于group+distinct)
[javascript] view plain copy print?
db.msds_accessrecord.aggregate([  
    {$group: {  
        _id: {  
            "month": {"$month": "$addtime"},  
            "url": "$url"  
        }  
    }},  
    {$group: {_id:"$_id.month", uv: {$sum: 1}}},  
    {$sort: {"_id":1}}  
]);  
这里用到了管道，排序，聚合

统计结果
[javascript] view plain copy print?
/* 0 */  
{  
    "result" : [   
        {  
            "_id" : 8,  
            "uv" : 41  
        },   
        {  
            "_id" : 9,  
            "uv" : 134  
        }  
    ],  
    "ok" : 1  
}  


引用：
聚合使用方法： http://docs.mongodb.org/manual/reference/method/db.collection.aggregate/#db.collection.aggregate
日期聚合函数： http://docs.mongodb.org/manual/reference/operator/aggregation-date/


# mongodb - how to find and then aggregate
down vote
accepted
You have to use $match:

db['!all'].aggregate([
  {$match://before group
    {'GENDER': 'F',
     'DOB':
      { $gte: 19400801,
        $lte: 20131231 } } },
  {$group:
     {_id: "$GENDER",
     totalscore:{ $sum: "$BRAINSCORE"}}}
])

Date Aggregation Operators

NOTE
For details on specific operator, including syntax and examples, click on the specific operator to go to its reference page.
Name	Description
$dayOfYear	Returns the day of the year for a date as a number between 1 and 366 (leap year).
$dayOfMonth	Returns the day of the month for a date as a number between 1 and 31.
$dayOfWeek	Returns the day of the week for a date as a number between 1 (Sunday) and 7 (Saturday).
$year	Returns the year for a date as a number (e.g. 2014).
$month	Returns the month for a date as a number between 1 (January) and 12 (December).
$week	Returns the week number for a date as a number between 0 (the partial week that precedes the first Sunday of the year) and 53 (leap year).
$hour	Returns the hour for a date as a number between 0 and 23.
$minute	Returns the minute for a date as a number between 0 and 59.
$second	Returns the seconds for a date as a number between 0 and 60 (leap seconds).
$millisecond	Returns the milliseconds of a date as a number between 0 and 999.
$dateToString	Returns the date as a formatted string.
$isoDayOfWeek	Returns the weekday number in ISO 8601 format, ranging from 1 (for Monday) to 7 (for Sunday).
$isoWeek	Returns the week number in ISO 8601 format, ranging from 1 to 53. Week numbers start at 1 with the week (Monday through Sunday) that contains the year’s first Thursday.
$isoWeekYear	Returns the year number in ISO 8601 format. The year starts with the Monday of week 1 (ISO 8601) and ends with the Sunday of the last week (ISO 8601).
←  	$literal (aggregation)	$dayOfYear (aggregation)	 →