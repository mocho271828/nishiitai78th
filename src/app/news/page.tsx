import { getNewsList } from "@/libs/microcms";
import FilteredContentList from '@/components/content/FilteredContentList';
// import { Badge } from "lucide-react";

export const revalidate = 60;

export default async function NewsPage() {
    const { contents: newsList } = await getNewsList();

    return (
        <main className="min-h-screen bg-slate-950 pt-24 px-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-white mb-10 border-b border-slate-800 pb-4">
                    NEWS <span className="text-sm font-normal text-slate-400 ml-4">お知らせ</span>
                </h1>

                <FilteredContentList items={newsList} basePath="news" />
            </div>
        </main>
    );
}
