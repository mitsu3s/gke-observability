# 公式の軽量Node.jsベースイメージ（Alpine Linux）
FROM node:20-alpine

# 作業ディレクトリを作成
WORKDIR /app

# 依存ファイルを先にコピー（キャッシュ活用）
COPY package*.json ./

# 依存をインストール
RUN npm ci --omit=dev

# ソースコードをコピー
COPY . .

# TypeScriptでビルド
RUN npm run build

# ポート指定（GKE側と合わせるため）
EXPOSE 3000

# アプリ起動（ビルド後のJSを実行）
CMD ["node", "dist/index.js"]
