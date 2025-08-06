'use client';

import ChatPage from './components/ChatPage';
import { AuthButtons } from './components/AuthButtons';

export default function Page() {
  return (
    <div>
      <AuthButtons />
      <ChatPage />
    </div>
  );
}
