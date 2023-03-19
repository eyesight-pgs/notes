# elastic-search

- `aur/elasticsearch`
- `aur/kibana-bin`


- installation

```txt
# first time
elasticsearch-keystore create
# the above command will create `/etc/elasticsearch/elasticsearch.keystore` file

# service
systemctl status elasticsearch
systemctl enable elasticsearch
systemctl start elasticsearch

# I don't know where to find the default password for `elastic` user
# just run below command to reset the password for `elastic` user
elasticsearch-reset-password -u elastic
# this will prompt for new password
```

- shards are for indices
  - split api - increase shard count
  - shrink api - decrease shard count

- replication
  - while creating index we can choose replica count
  - a `replica` is a copy of a `shard`

## basic

- view info
  - cluster: `GET {{local}}/_cluster/health`
  - node: `GET {{local}}/_cat/nodes?v=true`
  - index: `GET {{local}}/_cat/indices?v=true`
- get all documents
  ```http
  GET {{local}}/students/_search
  Content-Type: application/json

  {
    "query": {
      "match_all": {}
    }
  }
  ```

## create new index

```http
PUT  {{local}}/students
Content-Type: application/json

{
	"settings": {
		"number_of_shards": "3",
		"number_of_replicas": "3"
	}
}
```

## adding a document

```http
POST {{local}}/students/_doc
Content-Type: application/json

{
	"fullname": "Foo Bar",
	"dob": "2000-01-01",
	"gender": "male",
	"address": "aaaaaaaa bbbbbbb",
	"contact": "297234923498"
}
```

## updating single field (its more complext than what I thought)

```http
POST {{local}}/students/_update/28
Content-Type: application/json

{
	"script": {
		"source": "ctx._source.address=(params.newAddress)",
		"lang": "painless",
		"params": {
			"newAddress": "ssssssssss sssssssssss"
		}
	}
}
```

## update single field - simple way

```http
POST {{local}}/students/_update/28
Content-Type: application/json

{
	"doc": {
		"address": "ssssssssss ttttttttttttttt"
	}
}
```



