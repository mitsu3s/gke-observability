import "./otel-exporter";
import express from "express";
import { trace } from "@opentelemetry/api";

const app = express();
const port = process.env.PORT || 3000;

app.get("/hello", (_req, res) => {
  const tracer = trace.getTracer("manual");
  const span = tracer.startSpan("manual-span-hello");
  setTimeout(() => {
    span.end();
    res.send("Hello from GKE with manual span");
  }, 100);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
