```
mongodump -h ******:27017 -d sporttery -c matchresults -o matchresults.dat

mongorestore --drop -d sporttery -c matchresults matchresults.bson
```
