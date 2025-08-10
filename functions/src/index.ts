import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios from 'axios';

const MODEL_ID = 'openai/gpt-oss-120b';

const isEmulator = process.env.FUNCTIONS_EMULATOR === 'true' || !!process.env.FIRESTORE_EMULATOR_HOST;
if (isEmulator) {
  process.env.FIRESTORE_EMULATOR_HOST = process.env.FIRESTORE_EMULATOR_HOST || '127.0.0.1:8085';
}

admin.initializeApp({
  projectId: process.env.GCLOUD_PROJECT || process.env.GCP_PROJECT || 'ai-chat-app-3439d',
});

const db = admin.firestore();

const HUGGINGFACE_TOKEN: string | undefined = (functions.config() as any)?.huggingface?.token || process.env.HUGGINGFACE_TOKEN;

interface MessageData {
  text: string;
  uid: string;
  createdAt: any;
}

export const onNewMessage = functions.firestore
  .document('messages/{messageId}')
  .onCreate(async (snap) => {
    const messageData = snap.data() as MessageData;

    if (messageData.uid === 'bot') {
      return null;
    }

    const botText = await generateBotResponse(messageData.text).catch((err) => {
      console.error('Bot返信生成エラー(フォールバック適用):', err);
      return `🤖 いまは応答を生成できませんでした。あなたのメッセージ: "${messageData.text}"`;
    });

    await db.collection('messages').add({
      text: botText,
      uid: 'bot',
      createdAt: new Date(),
      replyTo: snap.id,
    });

    return null;
  });

async function generateBotResponse(userMessage: string): Promise<string> {
  if (!HUGGINGFACE_TOKEN) {
    return `🤖 トークン未設定のため簡易応答: "${userMessage}"`;
  }

  try {
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${MODEL_ID}`,
      {
        inputs: `You are a helpful assistant. Reply briefly in Japanese.\n\nUser: ${userMessage}\nAssistant:`,
        parameters: {
          max_new_tokens: 120,
          temperature: 0.7,
          top_p: 0.95,
          do_sample: true,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${HUGGINGFACE_TOKEN}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-Wait-For-Model': 'true',
        },
        timeout: 20000,
      }
    );

    if (Array.isArray(response.data)) {
      const text = (response.data[0] as any)?.generated_text;
      if (typeof text === 'string' && text.trim().length > 0) {
        return text.trim();
      }
    }

    return `🤖 応答生成に失敗しました（予期しないレスポンス）。メッセージ: "${userMessage}"`;
  } catch (error: any) {
    const status = error?.response?.status;
    if (status === 404) {
      return `🤖 モデルが見つかりません（${MODEL_ID}）。メッセージ: "${userMessage}"`;
    }
    return `🤖 エラーが発生しました（${status ?? 'unknown'}）。メッセージ: "${userMessage}"`;
  }
}


