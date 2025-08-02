import { DiagConsoleLogger, DiagLogLevel, diag } from "@opentelemetry/api";
import { logs, LoggerProvider, Logger } from "@opentelemetry/api-logs";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import {
  BatchLogRecordProcessor,
  LoggerProvider as SDKLoggerProvider,
} from "@opentelemetry/sdk-logs";

// デバッグ出力を有効に（必要な場合のみ）
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

// OpenTelemetry リソース定義
const resource = resourceFromAttributes({
  "service.name": "ts-observability-app",
});

// OTLP HTTP ログエクスポーター設定
const exporter = new OTLPLogExporter({
  url: "http://otel-collector.ts-observability.svc.cluster.local:4318/v1/logs",
  headers: {
    "x-goog-project-id": process.env.GOOGLE_CLOUD_PROJECT || "",
  },
});

// BatchLogRecordProcessorを正しく初期化
const processor = new BatchLogRecordProcessor(exporter);

// ロガープロバイダーの作成（processorは配列で渡す）
const provider = new SDKLoggerProvider({
  resource,
  processors: [processor],
});

// グローバルにロガーを登録
logs.setGlobalLoggerProvider(provider);

// ロガーの取得とログ送信
const logger: Logger = logs.getLogger("ts-observability-logger");

// ログ送信の例
logger.emit({
  severityNumber: 9, // INFO
  severityText: "INFO",
  body: "Log message from OpenTelemetry logger",
  attributes: {
    feature: "otel-logs",
    environment: "dev",
  },
});

// ロガーをエクスポート
export { logger };
