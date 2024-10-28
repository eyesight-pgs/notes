# fastify

```bash
npm i fastify
```

```js
import Fastify from 'fastify'
const app = Fastify();

app.get("/data", (request, reply) => {
  reply.send({ msg: "success" });
});

app.listen({ port: 3000, host: 'localhost' }, (err, address) => {
  if (err) {
    console.log(`server is listening on: ${address}`);
  }
});
```

## route
```js
const someRoute = {
    method: 'GET',
    url: '/health',
    handler: async (request, reply) => {
      reply.code(200).send({health: "good"});
    }
};

// here app is fastify instance
app.route(someRoute);
```

## route with json scehema
```js
export const HealthSchema = { // <--- defining schema
  type: 'object',
  properties: {
    message: {
      type: 'string',
      example: 'OK',
    },
  },
  required: ['message'],
  unevaluatedProperties: false,
  additionalProperties: false,
};

const someRoute = {
  method: 'GET',
  url: '/health',
  schema: {
    response: {
      200: HealthSchema, // <--- use schema
    },
  },
  handler: async (request, reply) => {
    reply.code(200).send({ message: "good" });
  }
}

app.route(someRoute);
```
