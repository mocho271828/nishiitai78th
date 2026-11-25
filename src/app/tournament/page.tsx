'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ImageIcon, Trophy } from 'lucide-react';

import { TournamentBracket } from '../_components/tournament/TournamentBracket';
import {
    getTournamentById,
    getTournamentTotalMatches,
    TOURNAMENT_IDS,
    type TournamentId,
} from '../_lib/tournamentData';
import BoardGuard from '@/components/auth/BoardlistGuard';

const SportSelector = ({
    selectedSport,
    onSelectSport,
}: {
    selectedSport: TournamentId;
    onSelectSport: (sport: TournamentId) => void;
}) => (
    <div className="-mx-6 overflow-x-auto px-6 pb-2 md:mx-0 md:px-0">
        <div className="flex w-max gap-2 rounded-full border border-white/10 bg-slate-900/80 p-1">
            {TOURNAMENT_IDS.map((sport) => {
                const isSelected = sport === selectedSport;
                const tournament = getTournamentById(sport);

                return (
                    <button
                        key={sport}
                        type="button"
                        onClick={() => onSelectSport(sport)}
                        className={`rounded-full px-4 py-2 text-sm font-bold whitespace-nowrap transition ${
                            isSelected
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-950/40'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                        aria-pressed={isSelected}
                    >
                        {tournament.name}
                    </button>
                );
            })}
        </div>
    </div>
);

const SummaryPill = ({ label, value }: { label: string; value: string }) => (
    <div className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2">
        <p className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
            {label}
        </p>
        <p className="mt-0.5 text-sm font-bold text-slate-100">{value}</p>
    </div>
);

export default function TournamentPage() {
    const [selectedSport, setSelectedSport] = useState<TournamentId>(TOURNAMENT_IDS[0]);

    const selectedTournament = getTournamentById(selectedSport);
    const rounds = selectedTournament.rounds;
    const totalMatches = getTournamentTotalMatches(rounds);

    return (
        <BoardGuard>
            <main className="min-h-screen bg-slate-950 px-6 pt-24 pb-20 text-white selection:bg-blue-500 selection:text-white">
                <div className="mx-auto flex max-w-7xl flex-col gap-6">
                    <header className="grid gap-5">
                        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                            <div className="min-w-0">
                                <p className="mb-2 text-xs font-bold tracking-[0.3em] text-blue-300">
                                    TOURNAMENT
                                </p>
                                <h1 className="flex min-w-0 items-center gap-3 text-3xl font-bold text-white md:text-4xl">
                                    <Trophy className="shrink-0 text-yellow-400" size={32} aria-hidden="true" />
                                    <span className="min-w-0 break-words">{selectedTournament.name}</span>
                                </h1>
                            </div>

                            <div className="grid grid-cols-2 gap-2 sm:flex">
                                <SummaryPill label="Rounds" value={`${rounds.length}`} />
                                <SummaryPill label="Matches" value={`${totalMatches}`} />
                            </div>
                        </div>

                        <aside className="rounded-xl border border-amber-400/25 bg-amber-400/10 p-4 md:p-5">
                            <div className="flex items-start gap-3">
                                <ImageIcon
                                    className="mt-0.5 shrink-0 text-amber-300"
                                    size={20}
                                    aria-hidden="true"
                                />
                                <div className="min-w-0">
                                    <h2 className="text-sm font-bold text-amber-100">
                                        画像で掲載している競技結果について
                                    </h2>
                                    <p className="mt-1 text-sm leading-relaxed text-slate-300">
                                        柔道など、試合結果を画像で掲載している競技は、このページでは閲覧できません。各競技ページの「試合結果」からご確認ください。
                                    </p>
                                    <Link
                                        href="/games"
                                        className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-amber-300 transition-colors hover:text-amber-200 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300"
                                    >
                                        競技一覧から確認する
                                        <ArrowRight size={16} aria-hidden="true" />
                                    </Link>
                                </div>
                            </div>
                        </aside>

                        <SportSelector
                            selectedSport={selectedSport}
                            onSelectSport={setSelectedSport}
                        />
                    </header>

                    <TournamentBracket rounds={rounds} />
                </div>
            </main>
        </BoardGuard>
    );
}
