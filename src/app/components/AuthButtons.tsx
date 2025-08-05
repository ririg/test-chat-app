// components/AuthButtons.tsx
'use client';

import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from 'lib/firebase';

export function AuthButtons() {
  const login = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <div className="flex gap-4 p-4">
      <button onClick={login} className="bg-green-500 text-white px-4 py-2 rounded">ログイン</button>
      <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">ログアウト</button>
    </div>
  );
}
