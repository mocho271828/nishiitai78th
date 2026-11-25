import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: '重要なお知らせ | 大会サイトの見本',
    description: '架空の大会の大会期間中に必要な競技、会場、宿泊・弁当、お問い合わせ情報を掲載しています。',
};

export default function ImportantPage() {
    return (
        <main className="min-h-screen bg-slate-950 pt-24 px-6 pb-20">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center text-slate-400 hover:text-blue-400 transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        ホームに戻る
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        IMPORTANT <span className="text-lg md:text-xl font-normal text-slate-400 ml-2 md:ml-4">重要なお知らせ</span>
                    </h1>
                    <p className="text-slate-400">
                        大会期間中に確認いただきたい情報と、各案内ページへの導線を掲載しています。
                    </p>
                </div>

                <div className="space-y-12">
                    <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-10">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                            <span className="w-1.5 h-8 bg-blue-500 rounded-full mr-4"></span>
                            大会期間中のご案内
                        </h2>

                        <div className="prose prose-invert max-w-none space-y-6 text-slate-300">
                            <div className="bg-blue-900/20 border border-blue-800/50 rounded-lg p-4">
                                <p className="text-blue-200 font-medium mb-2">📢 更新情報</p>
                                <p className="text-sm">
                                    この見本では、大会期間中の案内を掲載しています。競技日程、会場、結果などは以下の案内からご確認ください。
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-white mb-3">競技日程・結果</h3>
                                <div className="flex flex-wrap gap-3">
                                    <Link href="/games" className="text-blue-300 underline hover:text-blue-200">
                                        競技情報を確認する
                                    </Link>
                                    <Link href="/tournament" className="text-blue-300 underline hover:text-blue-200">
                                        大会結果を確認する
                                    </Link>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-white mb-3">会場・宿泊・弁当</h3>
                                <div className="flex flex-wrap gap-3">
                                    <Link href="/venues" className="text-blue-300 underline hover:text-blue-200">
                                        会場案内を確認する
                                    </Link>
                                    <Link href="/accommodation" className="text-blue-300 underline hover:text-blue-200">
                                        宿泊・弁当案内を確認する
                                    </Link>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-white mb-3">お問い合わせ</h3>
                                <p>
                                    登録内容の確認や大会期間中のご連絡は、
                                    <Link href="/contact" className="text-blue-300 underline hover:text-blue-200">
                                        お問い合わせページ
                                    </Link>
                                    をご利用ください。
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
