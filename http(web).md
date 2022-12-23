# http (web)

## json patch rfc

[json-patch-rfc](https://www.rfc-editor.org/rfc/rfc6902)

## patch operartions

```json
[
     { "op": "test", "path": "/a/b/c", "value": "foo" },
     { "op": "remove", "path": "/a/b/c" },
     { "op": "add", "path": "/a/b/c", "value": [ "foo", "bar" ] },
     { "op": "replace", "path": "/a/b/c", "value": 42 },
     { "op": "move", "from": "/a/b/c", "path": "/a/b/d" },
     { "op": "copy", "from": "/a/b/d", "path": "/a/b/e" }
]
```

- add: if item present then replace
- replace: if item not present then throw error

