# Mongodb 优化

## [官方推荐](https://docs.mongodb.com/manual/tutorial/manage-the-database-profiler/)

### Profiling Levels

```
db.setProfilingLevel(0,20)
```


### Disable Transparent Huge Pages (THP)
```bash
if test -f /sys/kernel/mm/transparent_hugepage/enabled; then  
   echo never > /sys/kernel/mm/transparent_hugepage/enabled  
fi  
if test -f /sys/kernel/mm/transparent_hugepage/defrag; then  
   echo never > /sys/kernel/mm/transparent_hugepage/defrag  
fi  
```