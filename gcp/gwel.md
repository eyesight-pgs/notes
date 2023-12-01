# google workflow expression language

- [syntax](https://cloud.google.com/workflows/docs/reference/syntax/expressions)
- use quotes if expression contains colon(`:`)
- max 400 characters per expression
- expression should be within `${` and `}`

## samples

- return value

```yml
- STEP_RETURN_VALUE_OF_VARIABLE:
    return: ${count}
```

- multiply

```yml
main:
  steps:
    - SQUARE_IT
        return: ${input.num * input.num}
```

- assign

```yml
main:
  params: [input]
  steps:
    - prepare1:
        assign:
          - hello: "Hello"
    - prepare2:
        assign:
          - world: " World!!"
    - greet:
        return: '${hello + world}'
```

output: Hello World!!










