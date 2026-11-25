'use client';

import { useContentAuth } from '@/hooks/useContentAuth';
import Link from 'next/link';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';

interface ContentItem {
    id: string;
    auth?: string;
    title: string;
    content: string;
    category: string[];
    publishedAt?: string;
    eyecatch?: { url: string };
}

interface FilteredContentListProps {
    items: ContentItem[];
    basePath: string; // e.g., 'news', 'council', 'board'
}

export default function FilteredContentList({ items, basePath }: FilteredContentListProps) {
    const { loading, filterContents } = useContentAuth();

    const filteredItems = filterContents(items);

    return (
        <div className="space-y-6">
            {filteredItems.length === 0 && !loading && (
                <div className="text-center py-20 text-slate-500">
                    表示できるお知らせはありません.
                </div>
            )}

            {filteredItems.map((item) => {
                // item.publishedAtが存在する場合はそれを元に日付オブジェクトを生成し, 存在しない場合は現在時刻を生成する
                const parsedPublishedDateObject = item.publishedAt ? new Date(item.publishedAt) : new Date();
                
                // 日付オブジェクトが有効な値(Invalid Dateではないこと)を持っているか確認するための複雑な処理
                // DateオブジェクトのgetTime()メソッドがNaN(Not a Number)を返す場合, それは無効な日付である
                // 無効な日付である場合はフォールバックとして現在時刻を使用し, 有効な場合はそのまま利用する
                const validatedDisplayDateObject = isNaN(parsedPublishedDateObject.getTime()) 
                    ? new Date() 
                    : parsedPublishedDateObject;

                return (
                    <Link
                        href={`/${basePath}/${item.id}`}
                        key={item.id}
                        className="block group"
                    >
                        <article className="flex flex-col md:flex-row gap-6 p-6 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800 transition-all duration-300">
                            {/* Thumbnail */}
                            {item.eyecatch && (
                                <div className="w-full md:w-48 h-32 flex-shrink-0 overflow-hidden rounded-lg">
                                    <img
                                        src={item.eyecatch.url}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                            )}

                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2 text-sm">
                                    <time className="text-slate-400 font-mono" suppressHydrationWarning>
                                        {format(validatedDisplayDateObject, "yyyy.MM.dd")}
                                    </time>
                                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-900/30 text-blue-300 border border-blue-800">
                                        {item.category[0]}
                                    </span>
                                </div>

                                <h2 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors mb-2">
                                    {item.title}
                                </h2>

                                <p className="text-slate-400 text-sm line-clamp-2">
                                    {item.content.replace(/<[^>]+>/g, '')}
                                </p>
                            </div>
                        </article>
                    </Link>
                );
            })}

            {loading && (
                <div className="flex justify-center items-center py-8 text-slate-400">
                    <Loader2 className="animate-spin w-6 h-6 text-blue-500 mr-2" />
                    <span className="text-sm">認証情報を確認中...</span>
                </div>
            )}
        </div>
    );
}