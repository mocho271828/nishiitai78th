import { getCouncilList } from "@/libs/microcms";
import WhitelistGuard from "@/components/auth/WhitelistGuard";
import FilteredContentList from '@/components/content/FilteredContentList';

export const revalidate = 60;

export default async function CouncilPage() {
    const { contents: councilList } = await getCouncilList();

    return (
        <WhitelistGuard>
            <main className="min-h-screen bg-slate-950 pt-24 px-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold text-white mb-10 border-b border-slate-800 pb-4">
                        COUNCIL <span className="text-sm font-normal text-slate-400 ml-4">評議会からのお知らせ</span>
                    </h1>

                    <FilteredContentList items={councilList} basePath="council" />
                </div>
            </main>
        </WhitelistGuard>
    );
}
