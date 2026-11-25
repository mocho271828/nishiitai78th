import { getNewsDetail, getNewsList } from "@/libs/microcms";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import ContentGuard from '@/components/auth/ContentGuard';
import SecureDownloadButton from "@/components/content/SecureDownloadButton";

// 全てのニュース情報のIDを取得し, 静的ルーティングのパラメータとして提供するための非同期関数である。
export async function generateStaticParams() {
    const newsListResultObject = await getNewsList();
    if (newsListResultObject.contents.length === 0) {
        return [{ id: '__empty__' }];
    }
    return newsListResultObject.contents.map((newsInformationObject) => {
        return {
            id: newsInformationObject.id,
        };
    });
}

// 静的エクスポート(output: "export")と競合するため, export const revalidate = 60; を削除した.

export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const parameterObject = await params;
    const newsDetailIdentificationString = parameterObject.id;

    if (newsDetailIdentificationString === '__empty__') {
        notFound();
    }

    // Promiseのcatchメソッドを使用してエラーを捕捉し, エラーメッセージを表示して例外を投げ処理を終了する.
    const newsDetailPostObject = await getNewsDetail(newsDetailIdentificationString).catch((errorObject) => {
        console.error("ニュース詳細データの取得中にエラーが発生しました", errorObject);
        throw new Error("データの取得中に致命的なエラーが発生しました. 処理を終了します.");
    });

    // 取得したデータに公開日時が存在する場合はそれを元に日付オブジェクトを生成し, 存在しない場合は現在時刻を生成する.
    const parsedPublishedDateObject = newsDetailPostObject.publishedAt 
        ? new Date(newsDetailPostObject.publishedAt) 
        : new Date();
    
    // 日付オブジェクトが有効な値(Invalid Dateではないこと)を持っているか確認するための複雑な処理である.
    // DateオブジェクトのgetTime()メソッドがNaN(Not a Number)を返す場合, それは無効な日付であると判定される.
    // 無効な日付である場合はフォールバックとして現在時刻を使用し, 有効な場合はそのまま利用する.
    const validatedDisplayDateObject = Number.isNaN(parsedPublishedDateObject.getTime()) 
        ? new Date() 
        : parsedPublishedDateObject;
    const shouldContainEyecatch = Boolean(
        newsDetailPostObject.eyecatch?.width
        && newsDetailPostObject.eyecatch?.height
        && newsDetailPostObject.eyecatch.height > newsDetailPostObject.eyecatch.width,
    );

    return (
        <main className="min-h-screen bg-slate-950 pt-24 px-6 pb-20">
            <ContentGuard authRequirement={newsDetailPostObject.auth}>
                <article className="max-w-3xl mx-auto bg-slate-900 rounded-2xl p-8 md:p-12 border border-slate-800 shadow-2xl">

                    {/* ヘッダー領域 */}
                    <header className="mb-10 border-b border-slate-800 pb-8">
                        <div className="flex gap-3 mb-4">
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white">
                                {newsDetailPostObject.category[0]}
                            </span>
                            <time className="text-slate-400 font-mono flex items-center">
                                {format(validatedDisplayDateObject, "yyyy.MM.dd")}
                            </time>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                            {newsDetailPostObject.title}
                        </h1>
                    </header>

                    {/* サムネイル画像領域 */}
                    {newsDetailPostObject.eyecatch && (
                        <div className="mb-10 rounded-xl overflow-hidden">
                            <img
                                src={newsDetailPostObject.eyecatch.url}
                                alt={newsDetailPostObject.title}
                                className={shouldContainEyecatch
                                    ? "w-full max-h-[640px] object-contain bg-slate-950"
                                    : "w-full object-cover max-h-[400px]"
                                }
                            />
                        </div>
                    )}

                    {/* 本文領域 */}
                    <div
                        className="prose prose-invert prose-blue max-w-none"
                        dangerouslySetInnerHTML={{ __html: newsDetailPostObject.content }}
                    />

                    {newsDetailPostObject.storageFilePath && (
                        <div className="mt-8 p-6 bg-slate-800 rounded-xl border border-slate-700">
                            <h2 className="text-white font-bold mb-3 flex items-center">
                                関係者限定添付ファイル
                            </h2>
                            <p className="text-sm text-slate-400 mb-4">
                                このファイルは権限を持つユーザーのみダウンロード可能
                            </p>
                            <SecureDownloadButton
                                storageFilePath={newsDetailPostObject.storageFilePath}
                                downloadFileName={`${newsDetailPostObject.title}.pdf`}
                            />
                        </div>
                    )}

                </article>
            </ContentGuard>
        </main>
    );
}
