# スクリーンショットツール

## 概要
Webページにアクセスし、スクリーンショットを取得するツールです。
PC/SPの両方のビューに対応しており、初回実行時にクッキーを保存して再利用します。

## プロジェクト構成

```
sttool/
├── src/
│   ├── config/
│   │   └── device-config.js    # デバイス設定（画面サイズ等）
│   ├── utils/
│   │   ├── cookie-manager.js   # クッキー管理
│   │   └── screenshot.js       # スクリーンショット機能
│   ├── services/
│   │   └── browser-service.js  # Playwrightブラウザ制御
│   └── index.js               # メインスクリプト
├── storage/
│   ├── cookies/               # クッキー保存ディレクトリ
│   └── screenshots/           # スクリーンショット保存ディレクトリ
└── package.json

```

## 機能仕様

### デバイス設定
- PC: 幅1280px、高さは全体表示
- SP: 幅375px、高さは全体表示

### スクリーンショット
- 形式: JPEG
- ファイル名: `URLのパス部分_YYMMDDHHMISS_デバイス種別.jpg`
  - 例：`order-history-list_230312192510_PC.jpg`
- 保存先: `storage/screenshots/`

### クッキー管理
- 保存場所: `storage/cookies/`
- 単一ユーザーのみ対応

## 使用方法

### 初回実行（クッキー取得）
```bash
$ node src/index.js --init
```
- Yahoo!ショッピングのログインページが開きます
- 手動でログインを実行してください
- ログイン完了後、自動的にクッキーが保存されます

### スクリーンショット取得
```bash
# PC版
$ node src/index.js --device=PC --url=https://odhistory.shopping.yahoo.co.jp/order-history/list

# SP版
$ node src/index.js --device=SP --url=https://odhistory.shopping.yahoo.co.jp/order-history/detail/xxxxxxxx
```

注意：URLは`http://`または`https://`から始まる完全な形式で指定する必要があります。

## エラー処理
- エラーメッセージは標準エラー出力に出力されます
- リトライ処理は実装しません
- クッキーが無効な場合は再度初期化（--init）が必要です

## 技術スタック
- Node.js
- Playwright（ブラウザ自動操作）

## 注意事項
- クッキーの有効期限に注意してください
- ネットワーク環境によってはタイムアウトする可能性があります
- スクリーンショットは実行時の相対パスに保存されます