# Cloud Functions + HuggingFace API セットアップ手順

## 1. Firebase CLIのインストール
```bash
npm install -g firebase-tools
```

## 2. Firebaseプロジェクトの初期化
```bash
firebase login
firebase init functions
```

## 3. Cloud Functionsの依存関係をインストール
```bash
cd functions
npm install
```

## 4. HuggingFace APIトークンの設定
1. [HuggingFace](https://huggingface.co/)でアカウントを作成
2. APIトークンを取得
3. Firebase Functionsの設定にトークンを追加：

```bash
firebase functions:config:set huggingface.token="YOUR_HUGGINGFACE_API_TOKEN"
```

## 5. Cloud Functionsのデプロイ
```bash
firebase deploy --only functions
```

## 6. 動作確認
1. アプリケーションを起動
2. メッセージを送信
3. Cloud Functionsが自動的にBot返信を生成することを確認

## 注意事項
- HuggingFace APIの利用制限に注意してください
- 本番環境では適切なエラーハンドリングとレート制限を実装してください
- セキュリティルールを適切に設定してください


