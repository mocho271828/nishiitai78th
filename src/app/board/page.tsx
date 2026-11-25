import { getBoardList } from "@/libs/microcms";
import AuthGuard from "@/components/auth/AuthGuard";
import FilteredContentList from '@/components/content/FilteredContentList';

export const revalidate = 60;

export default async function BoardPage() {
    const { contents: boardList } = await getBoardList();

    return (
        <AuthGuard>
            <main className="min-h-screen bg-slate-950 pt-24 px-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold text-white mb-10 border-b border-slate-800 pb-4">
                        BOARD <span className="text-sm font-normal text-slate-400 ml-4">理事会からのお知らせ</span>
                    </h1>

                    <FilteredContentList items={boardList} basePath="board" />
                </div>
            </main>
        </AuthGuard>
    );
}
