# awk practice

`awk [options] 'program' file`

awk value:

$0 : current row 
$1 : - n splicted item
NR : row Number
$NF :the last item
$(NF-n) : the last n item
NF : colum Number in current row 
FS : the input Separator
OFS : the output Separator
FILENAME : ...

### hoops
BEGIN : begin hoop
END : end hoop

```
$ awk 'BEGIN {print "START READ FILE"} {print $0} END {print "END READ FILE"}' /etc/passwd
```

### value 
```
$ awk '{msg="hello world";print msg}' /etc/passwd
# the value is global,and can be used in any {};
```
### math operation( + - * / %)
```
$ awk '{a=1;b=2; print a+b }' /etc/passwd
```
### if condition (> < == != ~[REG MATCH])
```
file.txt:
yahoo 100 4500 
google 150 7500
apple 180 8000
twitter 120 5000

$ awk '$3 == 5000 {print $0}' file.txt

$ awk -F ':' '$NF == "/bin/bash" {print $0}' /etc/passwd

```


### some practice
```bash
# test
awk 'print $0' /etc/passwd

# custom Separator
awk -F ':' '{print $1}' /etc/passwd
## $0 :ROW  $1-n spliced items

# custom mult Separator
awk -F '[()]' '{print $1,$2,$3}' /some/log
## ( OR )
```


### reg expression
```
$ awk '/^The/{print $0}' file.txt
```