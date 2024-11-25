# Mongo DB

## insert an item to an nested array to specific item
Ex:
animals collection:
```json
[
  {
    "animal_id": "cat",
    "foo": []
  },
  {
    "animal_id": "dog",
    "foo": [
      {
        "val": "ten",
        "fields": [
          {
            "f1": "v1"
          }
        ]
      },
      {
        "val": "ele",
        "fields": [
          { "f2": "v2" },
          // { "f3": "v3" } add this here
        ]
      }
    ]
  }
]
```
update qury:
```mongosh
db.animals.updateOne(
  { 
    "animal_id": "dog",
    "foo.val": "ele"
  },
  { 
    $push: {
      "foo.$.fields": { "f3": "v3" }
    }
  }
)
```

## delete a specific item from an nested array
Ex:
fruit collection
```json
[
  {
    "country": "India",
    "fruits": {
      "mainFruits": [
        "mango",
        "apple"
      ]
    }
  },
  "country": "USA",
  "fruits": {
      "mainFruits": [
        "banana",
        "apple" // <--- remove this
      ]
  }
]
```
updaete query:
```mongosh
db.fruit.updateOne(
  { country: "USA" },
  { $pull: { "fruits.mainFruits": "apple" } }
);
```
