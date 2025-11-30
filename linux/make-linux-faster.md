# make linux faster (RAM optimization)

## check RAM usage
```bash
free -h
```

## check and disable unwanted services
```bash
systemctl list-units --type=service --state=running
```








