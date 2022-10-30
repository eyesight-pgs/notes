# port

## kill process at port (on windows)

`netstat -o | findstr "<port>"`
last column of output will be process id

`taskkill /PID <process id> /F`

