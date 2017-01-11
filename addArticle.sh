#!/bin/bash

article=$1
echo 'creating '$article
DATE=`date +%Y-%m-%d`

printf '\n* ['$article'](https://github.com/nbwsc/blog/blob/master/blogs/'$article'.md)-'$DATE'\n' >> README.md
# echo -e '\n* ['$article'](https://github.com/nbwsc/blog/blob/master/blogs/'$article'.md)-'$DATE'\n' >> README.md

touch blogs/$article.md
