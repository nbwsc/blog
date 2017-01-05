```
mongodump -h ******:27017 -d sporttery -c matchresults -o matchresults.dat

mongorestore --drop -d sporttery -c matchresults matchresults.bson

# restore with auth & port
mongorestore --drop -d sporttery -c matchresults matchresults.bson --host=${ip} -u ${user} -p ${pwd} --authenticationDatabase ${db}
```
