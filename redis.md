# redis

## basics

- `keys *` - get all the keys
- `keys *some_key*` - searching for a key
- `get some_key` - get a value of key
- `mget key1 key2` - get values for multiple keys
- `flushall` - delete all the keys
- `set key value` - set value (update value)
- `mset firstkey "hello" secondkey "world"` - set multiple keys

## connect to remote machine

`redis-cli -h host -p port` - this will give prompt to enter password 
OR
`redis-cli -u redis://user:pass@host:port` - not recomanded ()


## delete multiple keys with prefix using regex

`redis-cli -h HOST -p PORT keys prefix\* | xargs redis-cli -h HOST -p PORT DEL`




