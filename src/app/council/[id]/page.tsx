import { getCouncilDetail, getCouncilList } from "@/libs/microcms";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import WhitelistGuard from "@/components/auth/WhitelistGuard";
import ContentGuard from '@/components/auth/ContentGuard';

// 全ての議会情報のIDを取得し, 静的ルーティングのパラメータとして提供するための非同期関数である.
export async function generateStaticParams() {
    const councilListResultObject = await getCouncilList();
    if (councilListResultObject.contents.length === 0) {
        return [{ id: '__empty__' }];
    }
    return councilListResultObject.contents.map((councilInformationObject) => {
        return {
            id: councilInformationObject.id,
        };
    });
}

// 静的エクスポート(output: "export")と競合するため, export const revalidate = 60; を削除した.

export default async function CouncilDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const parameterObject = await params;
    const councilDetailIdentificationString = parameterObject.id;

    if (councilDetailIdentificationString === '__empty__') {
        notFound();
    }

    // Promiseのcatchメソッドを使用してエラーを捕捉し, エラーメッセージを表示して例外を投げ処理を終了する.
    const councilDetailPostObject = await getCouncilDetail(councilDetailIdentificationString).catch((errorObject) => {
        console.error("議会詳細データの取得中にエラーが発生しました", errorObject);
        throw new Error("データの取得中に致命的なエラーが発生しました. 処理を終了します.");
    });

    // 取得したデータに公開日時が存在する場合はそれを元に日付オブジェクトを生成し, 存在しない場合は現在時刻を生成する.
    const parsedPublishedDateObject = councilDetailPostObject.publishedAt 
        ? new Date(councilDetailPostObject.publishedAt) 
        : new Date();
    
    // 日付オブジェクトが有効な値(Invalid Dateではないこと)を持っているか確認するための複雑な処理である.
    // DateオブジェクトのgetTime()メソッドがNaN(Not a Number)を返す場合, それは無効な日付であると判定される.
    // 無効な日付である場合はフォールバックとして現在時刻を使用し, 有効な場合はそのまま利用する.
    const validatedDisplayDateObject = Number.isNaN(parsedPublishedDateObject.getTime()) 
        ? new Date() 
        : parsedPublishedDateObject;

    return (
        <WhitelistGuard>
            <main className="min-h-screen bg-slate-950 pt-24 px-6 pb-20">
                <ContentGuard authRequirement={councilDetailPostObject.auth}>
                    <article className="max-w-3xl mx-auto bg-slate-900 rounded-2xl p-8 md:p-12 border border-slate-800 shadow-2xl">

                        {/* ヘッダー領域 */}
                        <header className="mb-10 border-b border-slate-800 pb-8">
                            <div className="flex gap-3 mb-4">
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white">
                                    {councilDetailPostObject.category[0]}
                                </span>
                                <time className="text-slate-400 font-mono flex items-center">
                                    {format(validatedDisplayDateObject, "yyyy.MM.dd")}
                                </time>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                                {councilDetailPostObject.title}
                            </h1>
                        </header>

                        {/* サムネイル画像領域 */}
                        {councilDetailPostObject.eyecatch && (
                            <div className="mb-10 rounded-xl overflow-hidden">
                                <img
                                    src={councilDetailPostObject.eyecatch.url}
                                    alt={councilDetailPostObject.title}
                                    className="w-full object-cover max-h-[400px]"
                                />
                            </div>
                        )}

                        {/* 本文領域 */}
                        <div
                            className="prose prose-invert prose-blue max-w-none"
                            dangerouslySetInnerHTML={{ __html: councilDetailPostObject.content }}
                        />

                    </article>
                </ContentGuard>
            </main>
        </WhitelistGuard>
    );
}