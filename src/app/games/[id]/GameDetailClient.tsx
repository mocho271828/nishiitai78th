'use client';

import { type KeyboardEvent, type ReactNode, useRef, useState } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity,
    ArrowLeft,
    Calendar,
    FileText,
    MapPin,
    Target,
    Trophy,
} from 'lucide-react';

import { TournamentBracket } from '../../_components/tournament/TournamentBracket';
import {
    getTournamentEntriesForGameId,
    getTournamentResultEntriesForGameId,
    getTournamentTotalMatches,
    type TournamentEntry,
    type TournamentId,
    type TournamentResultEntry,
} from '../../_lib/tournamentData';
import { GAMES_DATA } from '@/libs/games_data';
import { CompetitionProgramViewer } from './_components/CompetitionProgramViewer';
import { CompetitionResultImageViewer } from './_components/CompetitionResultImageViewer';
import { TournamentResults } from './_components/TournamentResults';
import { getCompetitionProgram } from './_lib/programData';
import { getCompetitionResultImageSet } from './_lib/resultImageData';

type DetailTabId = 'SCHEDULE' | 'RESULTS' | 'BRACKET' | 'PROGRAM';

const detailTabs: { id: DetailTabId; label: string; icon: ReactNode }[] = [
    { id: 'SCHEDULE', label: '日程・会場', icon: <Calendar size={18} /> },
    { id: 'RESULTS', label: '試合結果', icon: <Activity size={18} /> },
    { id: 'BRACKET', label: 'トーナメント表', icon: <Target size={18} /> },
    { id: 'PROGRAM', label: '競技別プログラム', icon: <FileText size={18} /> },
];

const EmptyBracketState = () => (
    <motion.div
        key="bracket-empty"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.3 }}
        className="flex h-full flex-col items-center justify-center py-20 text-center"
    >
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-800">
            <Target size={32} className="text-slate-500" />
        </div>
        <h2 className="mb-4 text-2xl font-bold text-white">トーナメント表は準備中です</h2>
        <p className="max-w-md text-slate-400">
            組み合わせ抽選会が終了し、トーナメントが確定次第こちらに掲載されます。
        </p>
    </motion.div>
);

const TournamentEntrySelector = ({
    entries,
    selectedTournamentId,
    onSelectTournament,
}: {
    entries: readonly {
        id: TournamentId;
        tournament: { name: string };
    }[];
    selectedTournamentId: TournamentId;
    onSelectTournament: (id: TournamentId) => void;
}) => {
    if (entries.length <= 1) {
        return null;
    }

    return (
        <div className="mb-6 flex flex-wrap gap-2">
            {entries.map((entry) => {
                const isSelected = entry.id === selectedTournamentId;

                return (
                    <button
                        key={entry.id}
                        type="button"
                        onClick={() => onSelectTournament(entry.id)}
                        className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                            isSelected
                                ? 'bg-red-600 text-white shadow-lg shadow-red-950/30'
                                : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                        aria-pressed={isSelected}
                    >
                        {entry.tournament.name}
                    </button>
                );
            })}
        </div>
    );
};

const ResultsTabContent = ({
    entries,
}: {
    entries: TournamentResultEntry[];
}) => {
    const [selectedTournamentId, setSelectedTournamentId] = useState<TournamentId | null>(
        entries[0]?.id ?? null,
    );
    const selectedEntry =
        entries.find((entry) => entry.id === selectedTournamentId) ?? entries[0] ?? null;
    const rounds = selectedEntry?.tournament.rounds ?? [];
    const totalResults = rounds.reduce(
        (total, round) => total + round.matches.length,
        0,
    );

    return (
        <motion.div
            key="results"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
        >
            {selectedEntry && (
                <TournamentEntrySelector
                    entries={entries}
                    selectedTournamentId={selectedEntry.id}
                    onSelectTournament={setSelectedTournamentId}
                />
            )}

            <div className="mb-6 flex flex-col gap-2">
                <h2 className="flex items-center gap-2 text-xl font-bold text-white">
                    <Activity className="text-red-500" />
                    {selectedEntry ? `${selectedEntry.tournament.name} 試合結果` : '試合結果'}
                </h2>
                {totalResults > 0 && (
                    <p className="text-sm font-bold text-slate-400">
                        確定・進行中 {totalResults} 試合
                    </p>
                )}
            </div>

            <TournamentResults rounds={rounds} />
        </motion.div>
    );
};

const BracketTabContent = ({
    entries,
}: {
    entries: TournamentEntry[];
}) => {
    const [selectedTournamentId, setSelectedTournamentId] = useState<TournamentId | null>(
        entries[0]?.id ?? null,
    );
    const selectedEntry =
        entries.find((entry) => entry.id === selectedTournamentId) ?? entries[0] ?? null;

    if (!selectedEntry) {
        return <EmptyBracketState />;
    }

    const totalMatches = getTournamentTotalMatches(selectedEntry.tournament.rounds);

    return (
        <motion.div
            key="bracket"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
        >
            <TournamentEntrySelector
                entries={entries}
                selectedTournamentId={selectedEntry.id}
                onSelectTournament={setSelectedTournamentId}
            />

            <div className="mb-6 flex flex-col gap-2">
                <h2 className="flex items-center gap-2 text-xl font-bold text-white">
                    <Target className="text-red-500" />
                    {selectedEntry.tournament.name} トーナメント表
                </h2>
                <p className="text-sm font-bold text-slate-500">
                    {selectedEntry.tournament.rounds.length} ラウンド / {totalMatches} 試合
                </p>
            </div>

            <TournamentBracket
                rounds={selectedEntry.tournament.rounds}
                mobileHelpText="表示を切り替えると、横スクロールのトーナメント表でも確認できます。"
            />
        </motion.div>
    );
};

export default function GameDetailClient({ id }: { id: string }) {
    const game = GAMES_DATA.find((g) => g.id === id);
    const tournamentEntries = getTournamentEntriesForGameId(id);
    const tournamentResultEntries = getTournamentResultEntriesForGameId(id);
    const competitionProgram = getCompetitionProgram(id);
    const competitionResultImageSet = getCompetitionResultImageSet(id);

    if (!game) {
        notFound();
    }

    const [activeTab, setActiveTab] = useState<DetailTabId>('SCHEDULE');
    const detailTabRefs = useRef<Partial<Record<DetailTabId, HTMLButtonElement | null>>>({});
    const availableDetailTabs = detailTabs.filter((tab) => {
        if (tab.id === 'PROGRAM') {
            return competitionProgram !== null;
        }

        if (tab.id === 'BRACKET') {
            return competitionResultImageSet === null;
        }

        return true;
    });
    const selectedDetailTab = availableDetailTabs.some((tab) => tab.id === activeTab)
        ? activeTab
        : (availableDetailTabs[0]?.id ?? 'SCHEDULE');

    const handleDetailTabKeyDown = (
        event: KeyboardEvent<HTMLButtonElement>,
        currentIndex: number,
    ) => {
        const lastIndex = availableDetailTabs.length - 1;
        let nextIndex: number | null = null;

        if (event.key === 'ArrowRight') {
            nextIndex = currentIndex === lastIndex ? 0 : currentIndex + 1;
        } else if (event.key === 'ArrowLeft') {
            nextIndex = currentIndex === 0 ? lastIndex : currentIndex - 1;
        } else if (event.key === 'Home') {
            nextIndex = 0;
        } else if (event.key === 'End') {
            nextIndex = lastIndex;
        }

        if (nextIndex === null) {
            return;
        }

        const nextTab = availableDetailTabs[nextIndex];
        if (!nextTab) {
            return;
        }

        event.preventDefault();
        setActiveTab(nextTab.id);
        detailTabRefs.current[nextTab.id]?.focus();
    };

    return (
        <main className="min-h-screen bg-slate-950 pt-24 pb-20 px-6">
            <div className="max-w-4xl mx-auto">
                <Link
                    href="/games"
                    className="inline-flex items-center text-slate-400 hover:text-white transition-colors mb-8 group"
                >
                    <ArrowLeft size={20} className="mr-2 transform group-hover:-translate-x-1 transition-transform" />
                    <span className="font-bold tracking-wider text-sm">競技一覧へ戻る</span>
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl"
                >
                    {/* Header */}
                    <div className="relative p-8 md:p-12 border-b border-slate-800 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 to-transparent"></div>
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <span className="inline-block px-3 py-1 mb-4 text-xs font-mono font-bold text-red-400 border border-red-900/50 bg-red-900/20 rounded-full">
                                    {game.category}
                                </span>
                                <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{game.name}</h1>
                                <p className="text-slate-500 font-mono tracking-widest uppercase">{game.enName}</p>
                            </div>
                            <div className="flex-shrink-0">
                                <Trophy size={48} className="text-slate-800" />
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div
                        className="flex border-b border-slate-800 px-4 md:px-8 overflow-x-auto no-scrollbar"
                        role="tablist"
                        aria-label={`${game.name}の詳細`}
                    >
                        {availableDetailTabs.map((tab, index) => (
                            <button
                                key={tab.id}
                                ref={(element) => {
                                    detailTabRefs.current[tab.id] = element;
                                }}
                                id={`game-detail-tab-${tab.id.toLowerCase()}`}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                onKeyDown={(event) => handleDetailTabKeyDown(event, index)}
                                role="tab"
                                aria-selected={selectedDetailTab === tab.id}
                                aria-controls="game-detail-tabpanel"
                                tabIndex={selectedDetailTab === tab.id ? 0 : -1}
                                className={`
                                    relative flex items-center gap-2 px-6 py-4 md:py-6 text-sm font-bold tracking-wider whitespace-nowrap transition-colors
                                    ${selectedDetailTab === tab.id ? 'text-white' : 'text-slate-500 hover:text-white'}
                                `}
                            >
                                {tab.icon}
                                {tab.label}
                                {selectedDetailTab === tab.id && (
                                    <motion.div
                                        layoutId="activeDetailTab"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div
                        id="game-detail-tabpanel"
                        className="p-8 md:p-12 min-h-[400px]"
                        role="tabpanel"
                        aria-labelledby={`game-detail-tab-${selectedDetailTab.toLowerCase()}`}
                    >
                        <AnimatePresence mode="wait">
                            {selectedDetailTab === 'SCHEDULE' && (
                                <motion.div
                                    key="schedule"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-8"
                                >
                                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                        <Calendar className="text-red-500" />
                                        スケジュール詳細
                                    </h2>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800">
                                            <div className="text-slate-500 mb-2 font-bold text-sm">開催期間</div>
                                            <div className="text-white text-lg font-medium">{game.date}</div>
                                        </div>
                                        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800">
                                            <div className="text-slate-500 mb-2 font-bold text-sm">主要会場</div>
                                            <div className="text-white text-lg font-medium flex items-center gap-2">
                                                <MapPin size={20} className="text-red-500 flex-shrink-0" />
                                                <span>{game.location}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* More schedule details can be added here if needed */}
                                    <div className="bg-blue-900/10 border border-blue-900/30 rounded-xl p-6 mt-8">
                                        <p className="text-blue-200/70 text-sm leading-relaxed">
                                            掲載している日程・会場・試合結果は、運営手順を試すための架空の情報です。
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            {selectedDetailTab === 'RESULTS' && (
                                competitionResultImageSet ? (
                                    <CompetitionResultImageViewer
                                        resultImageSet={competitionResultImageSet}
                                    />
                                ) : (
                                    <ResultsTabContent entries={tournamentResultEntries} />
                                )
                            )}

                            {selectedDetailTab === 'BRACKET' && (
                                <BracketTabContent entries={tournamentEntries} />
                            )}

                            {selectedDetailTab === 'PROGRAM' && competitionProgram && (
                                <motion.div
                                    key="program"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <CompetitionProgramViewer
                                        key={game.id}
                                        program={competitionProgram}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
