import { diag, DiagConsoleLogger, DiagLogLevel } from "@opentelemetry/api";
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";

const metricExporter = new OTLPMetricExporter({
  url: "http://otel-collector.ts-observability.svc.cluster.local:4318/v1/metrics",
  headers: {
    "x-goog-project-id": process.env.GOOGLE_CLOUD_PROJECT || "",
  },
});

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter({
    url: "http://otel-collector.ts-observability.svc.cluster.local:4318/v1/traces",
    headers: {
      "x-goog-project-id": process.env.GOOGLE_CLOUD_PROJECT || "",
    },
  }),
  metricReader: new PeriodicExportingMetricReader({
    exporter: metricExporter,
    exportIntervalMillis: 10000,
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

try {
  sdk.start();
  console.log("OpenTelemetry SDK started");
} catch (error: unknown) {
  console.error("Error starting OpenTelemetry SDK", error);
}
