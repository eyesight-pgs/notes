# redis

## Get all the keys

`keys *`

## Searching for a key
`keys *some_key*`


## get a value of key
`get some_key`


## get values for multiple keys

`mget key1 key2`

## delete all the keys

`flushall`

## set value (update value)

`set key value`

## set multiple keys

`mset firstkey "hello" secondkey "world"`

## connect to remote machine

`redis-cli -h host -p port` - this will give prompt to enter password 
OR
`redis-cli -u redis://user:pass@host:port` - not recomanded ()


## delete multiple keys with prefix using regex

`redis-cli -h HOST -p PORT keys prefix\* | xargs redis-cli -h HOST -p PORT DEL`




