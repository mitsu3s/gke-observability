import express from "express";
import {
  diag,
  DiagConsoleLogger,
  DiagLogLevel,
  trace,
} from "@opentelemetry/api";

import "./otel-exporter";

const app = express();
const port = 3000;

app.get("/hello", async (_req, res) => {
  const span = trace
    .getTracer("ts-observability-app")
    .startSpan("cpu-bound-operation");

  // ↓ 簡単なCPU負荷処理（カスタムメトリクスが出しやすい）
  const start = Date.now();
  let total = 0;
  for (let i = 0; i < 1e6; i++) total += Math.sqrt(i);
  const duration = Date.now() - start;

  span.end();

  res.send(`Hello! CPU load done in ${duration}ms`);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
