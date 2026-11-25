'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/libs/firebase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!auth) return;
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/'); // Redirect to home or previous page
        } catch {
            setError('ログインに失敗しました. メールアドレス, パスワードを確認し, Contactページよりご連絡ください. ');
        }
    };

    if (!auth) {
        return (
            <main className="min-h-screen bg-slate-950 px-6 pt-32 text-center text-white">
                <h1 className="text-2xl font-bold">ログイン機能の見本</h1>
                <p className="mt-4 text-slate-300">公開サンプルではアカウントを使用しません。競技日程や結果は「競技」から閲覧できます。</p>
            </main>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
            <form onSubmit={handleLogin} className="bg-slate-800 p-8 rounded-lg shadow-lg w-96">
                <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <div className="mb-4">
                    <label className="block mb-2 text-sm text-slate-400">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 rounded bg-slate-700 border border-slate-600 focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block mb-2 text-sm text-slate-400">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 rounded bg-slate-700 border border-slate-600 focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded transition-colors"
                >
                    Login
                </button>
            </form>
        </div>
    );
}
