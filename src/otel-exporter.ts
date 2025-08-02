import { diag, DiagConsoleLogger, DiagLogLevel } from "@opentelemetry/api";
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter({
    url: "http://otel-collector.ts-observability.svc.cluster.local:4318/v1/traces",
    headers: {
      "x-goog-project-id": process.env.GOOGLE_CLOUD_PROJECT || "",
    },
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

try {
  sdk.start();
  console.log("OpenTelemetry SDK started");
} catch (error: unknown) {
  console.error("Error starting OpenTelemetry SDK", error);
}
