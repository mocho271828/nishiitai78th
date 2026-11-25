'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/libs/firebase';
import { useBoardlist } from '@/hooks/useBoardlist';
import { Loader2, Lock } from 'lucide-react';

export default function BoardGuard({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!auth) {
            router.replace('/login');
            return;
        }
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (!currentUser) router.replace('/login');
            setAuthLoading(false);
        });
        return () => unsubscribe();
    }, [router]);

    const { isAllowed, loading: boardlistLoading } = useBoardlist(user?.email);

    if (authLoading || (user && boardlistLoading)) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
                <Loader2 className="animate-spin mr-2" /> Checking permissions...
            </div>
        );
    }

    if (user && !isAllowed) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-6">
                <div className="bg-red-900/20 p-6 rounded-2xl border border-red-500/50 text-center max-w-md">
                    <Lock className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold mb-2">アクセス権限がありません</h2>
                    <p className="text-slate-400 text-sm mb-6">
                        アカウント ({user.email}) はこのページの閲覧を許可されていません.<br />
                        管理者に問い合わせてください.
                    </p>
                    <button
                        onClick={() => auth?.signOut()}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded text-sm transition-colors"
                    >
                        ログアウト
                    </button>
                </div>
            </div>
        );
    }

    return user ? <>{children}</> : null;
}
