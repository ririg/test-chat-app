// components/AuthButtons.tsx
'use client';

import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from 'lib/firebase';
import { useEffect, useState } from 'react';

export function AuthButtons() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('ログインエラー:', error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  };

  if (loading) {
    return <div className="p-4">読み込み中...</div>;
  }

  return (
    <div className="flex gap-4 p-4">
      {user ? (
        <div className="flex gap-4 items-center">
          <span>ようこそ、{user.displayName}さん</span>
          <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">ログアウト</button>
        </div>
      ) : (
        <button onClick={login} className="bg-green-500 text-white px-4 py-2 rounded">ログイン</button>
      )}
    </div>
  );
}
