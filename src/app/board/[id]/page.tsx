import { PUBLIC_BOARD_MINUTES_PATH, SAMPLE_BOARD_ID } from '@/_constants/news';
import { getBoardDetail, getBoardList } from "@/libs/microcms";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import WhitelistGuard from "@/components/auth/WhitelistGuard";
import ContentGuard from '@/components/auth/ContentGuard';
import SecureDownloadButton from "@/components/content/SecureDownloadButton";

// Static Params Generation
export async function generateStaticParams() {
    const boardListResultObject = await getBoardList();
    if (boardListResultObject.contents.length === 0) {
        return [{ id: '__empty__' }];
    }
    return boardListResultObject.contents.map((boardInformationObject) => {
        return {
            id: boardInformationObject.id,
        };
    });
}

// export const revalidate = 60;

export default async function BoardDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const parameterObject = await params;
    const boardDetailIdentificationString = parameterObject.id;

    if (boardDetailIdentificationString === '__empty__') {
        notFound();
    }

    // Promiseのcatchメソッドを使用してエラーを捕捉し, エラーメッセージを表示して例外を投げ処理を終了する.
    const boardDetailPostObject = await getBoardDetail(boardDetailIdentificationString).catch((errorObject) => {
        console.error("データの取得中にエラーが発生しました", errorObject);
        throw new Error("データの取得中にエラーが発生しました. 処理を終了します.");
    });

    // boardDetailPostObject.publishedAtが存在する場合はそれを元に日付オブジェクトを生成し, 存在しない場合は現在時刻を生成する.
    const parsedPublishedDateObject = boardDetailPostObject.publishedAt ? new Date(boardDetailPostObject.publishedAt) : new Date();
    
    // 日付オブジェクトが有効な値(Invalid Dateではないこと)を持っているか確認するための複雑な処理.
    // DateオブジェクトのgetTime()メソッドがNaN(Not a Number)を返す場合, それは無効な日付である.
    // 無効な日付である場合はフォールバックとして現在時刻を使用し, 有効な場合はそのまま利用する.
    const validatedDisplayDateObject = Number.isNaN(parsedPublishedDateObject.getTime()) 
        ? new Date() 
        : parsedPublishedDateObject;
    const isPublicFile = boardDetailPostObject.id === SAMPLE_BOARD_ID &&
        boardDetailPostObject.isPublicFile === true &&
        boardDetailPostObject.filePath === PUBLIC_BOARD_MINUTES_PATH;

    return (
        <WhitelistGuard>
            <main className="min-h-screen bg-slate-950 pt-24 px-6 pb-20">
                <ContentGuard authRequirement={boardDetailPostObject.auth}>
                    <article className="max-w-3xl mx-auto bg-slate-900 rounded-2xl p-8 md:p-12 border border-slate-800 shadow-2xl">

                        {/* Header */}
                        <header className="mb-10 border-b border-slate-800 pb-8">
                            <div className="flex gap-3 mb-4">
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white">
                                    {boardDetailPostObject.category[0]}
                                </span>
                                <time className="text-slate-400 font-mono flex items-center">
                                    {format(validatedDisplayDateObject, "yyyy.MM.dd")}
                                </time>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                                {boardDetailPostObject.title}
                            </h1>
                        </header>

                        {/* Thumbnail */}
                        {boardDetailPostObject.eyecatch && (
                            <div className="mb-10 rounded-xl overflow-hidden">
                                <img
                                    src={boardDetailPostObject.eyecatch.url}
                                    alt={boardDetailPostObject.title}
                                    className="w-full object-cover max-h-[400px]"
                                />
                            </div>
                        )}

                        {/* Body Content */}
                        <div
                            className="prose prose-invert prose-blue max-w-none mb-10"
                            dangerouslySetInnerHTML={{ __html: boardDetailPostObject.content }}
                        />

                        {(isPublicFile || boardDetailPostObject.storageFilePath) && (
                            <div className="mt-8 p-6 bg-slate-800 rounded-xl border border-slate-700">
                                <h2 className="text-white font-bold mb-3 flex items-center">
                                    {isPublicFile ? '公開添付ファイル' : '関係者限定添付ファイル'}
                                </h2>
                                <p className="text-sm text-slate-400 mb-4">
                                    {isPublicFile
                                        ? 'このファイルは公開URLからダウンロードできます'
                                        : 'このファイルは権限を持つユーザーのみダウンロード可能'}
                                </p>
                                {isPublicFile && (
                                    <a className="text-blue-300 underline" href={PUBLIC_BOARD_MINUTES_PATH} download={`${boardDetailPostObject.title}.pdf`}>
                                        ダウンロード
                                    </a>
                                )}
                                {!isPublicFile && boardDetailPostObject.storageFilePath && (
                                    <SecureDownloadButton
                                        storageFilePath={boardDetailPostObject.storageFilePath}
                                        downloadFileName={`${boardDetailPostObject.title}.pdf`}
                                    />
                                )}
                            </div>
                        )}
                    </article>
                </ContentGuard>
            </main>
        </WhitelistGuard>
    );
}
