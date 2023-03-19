# port

## kill process at port

- linux
```sh
# get the port and process id
ss -tpuln | grep -i -e '[port|listen]'

# kill it
kill -9 <pid>
```

- windows
```cmd
# find the process id (last column of output will be process id)
netstat -o | findstr "<port>"

# kill it
taskkill /PID <process id> /F
```

