import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from 'lib/firebase';

export function UserInfo() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  if (!user) return <p>ログインしていません</p>;

  return (
    <div className="p-4 text-sm text-gray-600">
      ログイン中：{user.displayName}（{user.email}）
    </div>
  );
}