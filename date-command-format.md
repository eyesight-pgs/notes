# date command - formatting

date "+FORMAT"

%Y ---> 2022
%m ---> 01...12
%d ---> 01...31

%H ---> 00...24 (hour)
%_H ---> " 0"..."24" (same as %H but padded with space)
%I ---> 01...12 (hour)
%_I ---> "1"..."12" (same as %I but padded with space)
%M ---> 00..59 (minutes)
%S ---> 00..59 (seconds)


# example:
```bash
$date "+%Y-%m-%d %H:%M:%S"
2022-05-15 23:10:04

$date "+%b %d %_I:%M"
May 15 11:10
```
