'use client';

import { useContentAuth } from '@/hooks/useContentAuth';
import { Loader2, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ContentGuardProps {
    children: React.ReactNode;
    authRequirement?: string;
}

export default function ContentGuard({ children, authRequirement }: ContentGuardProps) {
    const { loading, canView, user } = useContentAuth();
    const router = useRouter();

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20 text-slate-400">
                <Loader2 className="animate-spin mr-2" /> 権限を確認しています...
            </div>
        );
    }

    if (!canView(authRequirement)) {
        return (
            <div className="flex flex-col items-center justify-center text-white py-12 px-6">
                <div className="bg-red-900/20 p-8 rounded-2xl border border-red-500/50 text-center max-w-md w-full">
                    <Lock className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold mb-2">アクセス権限がありません</h2>
                    <p className="text-slate-400 text-sm mb-6">
                        {user
                            ? `アカウント (${user.email}) はこのコンテンツの閲覧を許可されていません.`
                            : `このコンテンツを閲覧するにはログインが必要です.`
                        }
                    </p>
                    {!user && (
                        <button
                            onClick={() => router.push('/login')}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded text-sm transition-colors mb-4 block w-full"
                        >
                            ログインページへ
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
