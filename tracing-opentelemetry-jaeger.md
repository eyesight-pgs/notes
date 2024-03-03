# Opentelemetry with Jaeger

Open telemetry provides facility to collect traces from applications.

Jaeger is agent and collector.

The application will have a trace client which will send the trace details to:
- either agent (agent will forward to collector)
- or directly to collector

Traces collected in collector will be used for display complete trace for an action.

## setup (testing in local with NodeJs app)

Step1: start jaeger agent and/or collector

Reference: https://www.jaegertracing.io/docs/1.22/getting-started/#all-in-one

```bash
docker run -d --name jaeger \
  -e COLLECTOR_ZIPKIN_HOST_PORT=:9411 \
  -p 5775:5775/udp \
  -p 6831:6831/udp \
  -p 6832:6832/udp \
  -p 5778:5778 \
  -p 16686:16686 \
  -p 14268:14268 \
  -p 14250:14250 \
  -p 9411:9411 \
  jaegertracing/all-in-one:1.22
```

Step2: Add client inside NodeJs app

index.ts
```ts
import express, { NextFunction } from "express";
import { downStream, upStream } from "./middleware";

const app = express();
app.use(upStream);

let i = 0;
app.get("/health", (req:any, res:any, next: NextFunction) => {
  console.log(`${++i} serving`);
  res.send({msg: "ok"});
  next();
});

app.use(downStream);

const port = 7788;
app.listen(port, "0.0.0.0", () => {
  console.log(`listening on ${port}`);
});
```

tracing.ts
```ts
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { JaegerPropagator } from "@opentelemetry/propagator-jaeger";
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { JaegerExporter } from "@opentelemetry/exporter-jaeger";

// create provider
const resource = new Resource({
  [SemanticResourceAttributes.HOST_NAME]: "localhost",
  [SemanticResourceAttributes.SERVICE_NAME]: "tc-aggregator-service",
  [SemanticResourceAttributes.SERVICE_VERSION]: "some string",
  [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: "some string",
});
const provider = new NodeTracerProvider({ resource });

// ========== exporter-jaeger ==========
const options = {
  tags: [], // optional
  // You can use the default UDPSender
  host: 'localhost', // optional
  port: 6832, // optional
  // OR you can use the HTTPSender as follows
  // endpoint: 'http://localhost:14268/api/traces',
  maxPacketSize: 65000 // optional
}
const exporter = new JaegerExporter(options);
// ========== exporter-jaeger ==========

// add exporter
provider.addSpanProcessor(new BatchSpanProcessor(
  exporter
));
provider.register({ propagator: new JaegerPropagator() });

export const tracer = provider.getTracer("my-jaeger", "v11");
console.log("||||||tracer created||||||");
```

middleware.ts
```ts
import { NextFunction } from "express";
import { tracer } from "./tracing";
import { Span } from "@opentelemetry/api";

export function upStream(req: any, res: any, next: NextFunction) {
  // start the span
  const span: Span = tracer.startSpan(req.path);
  req.span = span;
  next();
}

export function downStream(req: any, res: any, next: NextFunction) {
  // end the span
  req.span.end();
  next();
}
```

Step3: validate the stetup

- Hit the express endpoint... like `curl http://localhost:7788/health`. This should publish the trace to agent/collector.
- Veiw the trace by visiting UI for jaeger: `http://localhost:16686`


## References
- [Architecture](https://github.com/jaegertracing/jaeger?tab=readme-ov-file#jaeger---a-distributed-tracing-system)
- [@opentelemetry/exporter-jaeger](https://www.npmjs.com/package/@opentelemetry/exporter-jaeger)
- [Bypass the Jaeger Agent](https://www.jaegertracing.io/docs/1.54/troubleshooting/#bypass-the-jaeger-agent)
- [api-docs](https://open-telemetry.github.io/opentelemetry-js/)
- [migration](https://opentelemetry.io/docs/migration/opentracing/)
- [without-exporter-jaeger](https://medium.com/@sevicdev/tracing-node-js-microservices-with-opentelemetry-ccdd980f8d51)



