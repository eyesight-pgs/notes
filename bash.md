# bash scripting

## check if last command was successful

TLDR:
  `$?`
  `if my_command; then...`
    
```bash
my_command;
if [ $? -eq 0 ]; then
  echo "success";
else
  echo "failed";
fi
```

other way:
```bash
if my_command; then
  echo "success";
else
  echo "failed"
fi
```


function call
```bash
hello() {
    echo "hello $1"
}
hello "Mr. Foo"
```





