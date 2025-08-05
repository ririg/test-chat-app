'use client';

import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { db, auth } from 'lib/firebase';

import { useEffect, useState } from 'react';

export default function ChatPage() {
  const [messages, setMessages] = useState<
    { id: string; text: string; uid: string }[]
  >([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('createdAt'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as { text: string; uid: string }),
      }));
      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, []);

  const handleSend = async () => {
    if (input.trim() === '') return;

    try {
      const userMessage = input.trim();

      await addDoc(collection(db, 'messages'), {
        text: userMessage,
        createdAt: serverTimestamp(),
        uid: auth.currentUser?.uid || 'guest',
      });

      setInput('');

      setTimeout(async () => {
        try {
          await addDoc(collection(db, 'messages'), {
            text: `🤖 Bot: 「${userMessage}」に対する自動返信です！`,
            createdAt: serverTimestamp(),
            uid: 'bot',
          });
        } catch (error) {
          console.error('❌ Botの返信エラー:', error);
        }
      }, 2000);
    } catch (error) {
      console.error('メッセージ送信エラー:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen p-4 bg-gray-100 space-y-4">
      <div className="flex-1 overflow-y-auto flex flex-col space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded shadow w-fit max-w-xs ${
              msg.uid === 'bot'
                ? 'bg-green-100 self-start'
                : 'bg-blue-100 self-end'
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="flex space-x-2 pb-20">
        <input
          type="text"
          className="flex-1 border rounded px-3 py-2"
          placeholder="メッセージを入力"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleSend}
        >
          送信
        </button>
      </div>
    </div>
  );
}
