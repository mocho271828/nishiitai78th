'use client';

import { useState } from 'react';
import { Download, ExternalLink, FileText, Smartphone } from 'lucide-react';

import type { CompetitionProgram, CompetitionProgramDocument } from '../_lib/programData';

type CompetitionProgramViewerProps = {
    program: CompetitionProgram;
};

export function CompetitionProgramViewer({ program }: CompetitionProgramViewerProps) {
    const { documents } = program;
    const [selectedDocumentId, setSelectedDocumentId] = useState<CompetitionProgramDocument['id']>(
        () => documents[0]?.id ?? 'schedule',
    );
    const activeDocument =
        documents.find((document) => document.id === selectedDocumentId) ??
        documents[0];

    if (!activeDocument) {
        return (
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 text-sm text-slate-400">
                競技別プログラムは準備中です。
            </div>
        );
    }

    const viewerTitle = `${program.sportName} 競技別プログラム（${activeDocument.label}）PDF`;
    const publishedDocumentLabels = documents.map((document) => document.label).join('・');

    return (
        <section aria-labelledby="competition-program-heading" className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h2
                        id="competition-program-heading"
                        className="flex items-center gap-2 text-xl font-bold text-white"
                    >
                        <FileText className="text-red-500" aria-hidden="true" />
                        競技別プログラム
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">
                        {program.sportName}の{publishedDocumentLabels}を閲覧できます。
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <a
                        href={activeDocument.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-bold text-slate-200 transition-colors hover:border-red-500/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                    >
                        <ExternalLink size={16} aria-hidden="true" />
                        別タブで開く
                    </a>
                    <a
                        href={activeDocument.href}
                        download={activeDocument.downloadFileName}
                        className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                    >
                        <Download size={16} aria-hidden="true" />
                        ダウンロード
                    </a>
                </div>
            </div>

            <div
                className="flex flex-wrap gap-2"
                role="group"
                aria-label="表示する競技別プログラムの種類"
            >
                {documents.map((document) => {
                    const isSelected = document.id === activeDocument.id;

                    return (
                        <button
                            key={document.id}
                            type="button"
                            onClick={() => setSelectedDocumentId(document.id)}
                            aria-pressed={isSelected}
                            aria-controls="competition-program-pdf"
                            className={`rounded-full border px-4 py-2 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${
                                isSelected
                                    ? 'border-red-500 bg-red-600 text-white shadow-lg shadow-red-950/30'
                                    : 'border-slate-700 bg-slate-950 text-slate-400 hover:border-slate-500 hover:text-white'
                            }`}
                        >
                            {document.label}
                            <span className="ml-1 text-xs opacity-75">({document.pageCount}ページ)</span>
                        </button>
                    );
                })}
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-inner">
                <iframe
                    key={activeDocument.href}
                    id="competition-program-pdf"
                    src={activeDocument.href}
                    title={viewerTitle}
                    loading="lazy"
                    className="h-[70vh] min-h-[520px] w-full bg-white"
                />
            </div>

            <div className="flex gap-3 rounded-xl border border-blue-900/30 bg-blue-900/10 p-4 text-sm leading-relaxed text-blue-200/80 md:hidden">
                <Smartphone className="mt-0.5 shrink-0" size={18} aria-hidden="true" />
                <p>
                    スマートフォンでPDFが表示されない場合は、「別タブで開く」または「ダウンロード」をご利用ください。
                </p>
            </div>
        </section>
    );
}
