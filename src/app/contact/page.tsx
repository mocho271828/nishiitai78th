import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Lock, Mail, Users } from 'lucide-react';

export const metadata: Metadata = {
    title: '問い合わせ窓口 | 大会サイトの見本',
    description: '架空の大会事務局の連絡先を掲載する例です。',
};

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-slate-950 px-6 pt-24 pb-20 font-sans selection:bg-red-500 selection:text-white">
            <div className="mx-auto max-w-4xl">
                <header className="mb-12 text-center">
                    <h1 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
                        CONTACT
                    </h1>
                    <p className="text-lg text-slate-400">
                        大会事務局の連絡先（サンプル）
                    </p>
                </header>

                <section aria-labelledby="contact-heading" className="rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-10">
                    <h2 id="contact-heading" className="mb-3 text-2xl font-bold text-white">大会事務局</h2>
                    <p className="mb-6 text-slate-300">架空の問い合わせ先です。この公開見本からメール送信や電話発信はできません。</p>
                    <div className="flex items-start gap-4 rounded-xl border border-slate-700 p-5">
                        <Mail className="text-blue-300" size={24} aria-hidden="true" />
                        <div>
                            <h3 className="font-bold text-white">参加に関する問い合わせ先の例</h3>
                            <p className="mt-1 text-blue-200">office@example.org</p>
                        </div>
                    </div>
                </section>

                <section aria-labelledby="related-links-heading" className="mt-8">
                    <h2 id="related-links-heading" className="sr-only">関連ページ</h2>
                    <Link
                        href="/members"
                        className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-5 transition-colors hover:bg-white/10"
                    >
                        <span className="flex items-center gap-3">
                            <span className="relative rounded-full bg-blue-500/10 p-3">
                                <Users className="text-blue-300" size={22} aria-hidden="true" />
                                <Lock
                                    className="absolute -right-1 -bottom-1 text-slate-400"
                                    size={13}
                                    aria-hidden="true"
                                />
                            </span>
                            <span>
                                <span className="block font-bold text-white">運営委員会役員連絡先</span>
                                <span className="text-sm text-slate-400">関係者専用・ログインが必要です</span>
                            </span>
                        </span>
                        <ArrowRight
                            className="text-slate-500 transition-transform group-hover:translate-x-1 group-hover:text-blue-300"
                            size={20}
                            aria-hidden="true"
                        />
                    </Link>
                </section>
            </div>
        </main>
    );
}
