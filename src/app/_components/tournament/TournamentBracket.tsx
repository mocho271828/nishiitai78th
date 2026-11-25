'use client';

import { type ElementType, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarDays, ChevronRight, List, Table2 } from 'lucide-react';

import {
    createTournamentMatchMap,
    type TournamentMatch,
    type TournamentRound,
    type TournamentTeam,
} from '../../_lib/tournamentData';

type MobileViewMode = 'list' | 'board';

type TournamentBracketProps = {
    rounds: readonly TournamentRound[];
    className?: string;
    emptyMessage?: string;
    mobileHelpText?: string;
};

const getMatchLabel = (match: Pick<TournamentMatch, 'id' | 'startTime'>): string =>
    match.startTime || match.id;

const getNextMatchLabel = (
    match: Pick<TournamentMatch, 'nextMatchId'>,
    matchById: ReadonlyMap<string, TournamentMatch>,
): string => {
    if (!match.nextMatchId) {
        return '最終試合';
    }

    const nextMatch = matchById.get(match.nextMatchId);
    return nextMatch ? getMatchLabel(nextMatch) : match.nextMatchId;
};

const MobileViewToggle = ({
    viewMode,
    onChangeViewMode,
}: {
    viewMode: MobileViewMode;
    onChangeViewMode: (viewMode: MobileViewMode) => void;
}) => {
    const modes: { value: MobileViewMode; label: string; icon: ElementType }[] = [
        { value: 'list', label: '一覧', icon: List },
        { value: 'board', label: '表', icon: Table2 },
    ];

    return (
        <div className="grid grid-cols-2 rounded-lg border border-white/10 bg-slate-900 p-1 md:hidden">
            {modes.map((mode) => {
                const Icon = mode.icon;
                const isSelected = mode.value === viewMode;

                return (
                    <button
                        key={mode.value}
                        type="button"
                        onClick={() => onChangeViewMode(mode.value)}
                        className={`flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-bold transition ${
                            isSelected
                                ? 'bg-blue-600 text-white'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                        aria-pressed={isSelected}
                    >
                        <Icon size={16} aria-hidden="true" />
                        {mode.label}
                    </button>
                );
            })}
        </div>
    );
};

const TeamLine = ({ team }: { team: TournamentTeam }) => (
    <div className="min-w-0 rounded-md border border-white/5 bg-slate-950/70 px-3 py-2">
        <p className="break-words text-sm leading-snug font-bold text-slate-100">
            {team.univ}
        </p>
        {team.name !== team.univ && (
            <p className="mt-1 break-words text-xs leading-snug text-slate-500">
                {team.name}
            </p>
        )}
    </div>
);

const MatchCard = ({
    match,
    matchById,
    compact = false,
}: {
    match: TournamentMatch;
    matchById: ReadonlyMap<string, TournamentMatch>;
    compact?: boolean;
}) => {
    const matchLabel = getMatchLabel(match);
    const nextMatchLabel = getNextMatchLabel(match, matchById);

    return (
        <motion.article
            layout
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.25 }}
            className={`rounded-lg border border-white/10 bg-slate-900/95 shadow-xl shadow-slate-950/20 ${
                compact ? 'w-full' : 'w-[17rem] sm:w-72'
            }`}
        >
            <div className="flex items-center justify-between gap-3 border-b border-white/10 px-3 py-2">
                <div className="flex min-w-0 items-center gap-2">
                    <CalendarDays size={15} className="shrink-0 text-blue-300" aria-hidden="true" />
                    <span className="truncate text-xs font-bold tracking-wide text-slate-300">
                        試合 {matchLabel}
                    </span>
                </div>
                <span className="shrink-0 rounded-full bg-slate-950 px-2 py-1 text-[11px] font-bold text-slate-400">
                    予定
                </span>
            </div>

            <div className="grid gap-2 p-3">
                <TeamLine team={match.teams[0]} />
                <TeamLine team={match.teams[1]} />
            </div>

            <div className="flex items-center gap-2 border-t border-white/10 px-3 py-2 text-xs font-bold text-slate-500">
                <ChevronRight size={14} className="shrink-0 text-yellow-400" aria-hidden="true" />
                <span className="min-w-0 break-words">
                    {match.nextMatchId ? `次: ${nextMatchLabel}` : nextMatchLabel}
                </span>
            </div>
        </motion.article>
    );
};

const RoundColumn = ({
    round,
    matchById,
}: {
    round: TournamentRound;
    matchById: ReadonlyMap<string, TournamentMatch>;
}) => (
    <section className="flex w-[17rem] shrink-0 flex-col sm:w-72">
        <div className="mb-3 rounded-lg border border-white/10 bg-slate-950/95 px-4 py-3 text-center backdrop-blur">
            <p className="text-sm font-bold tracking-wider text-slate-100">{round.name}</p>
            <p className="mt-1 text-xs font-bold text-slate-500">
                {round.matches.length} 試合
            </p>
        </div>

        <div className="flex flex-col gap-3">
            {round.matches.map((match) => (
                <MatchCard key={match.id} match={match} matchById={matchById} />
            ))}
        </div>
    </section>
);

const BracketBoard = ({
    rounds,
    matchById,
}: {
    rounds: readonly TournamentRound[];
    matchById: ReadonlyMap<string, TournamentMatch>;
}) => (
    <div className="w-full max-w-full min-w-0 overflow-x-auto rounded-lg border border-white/10 bg-slate-900/40 overscroll-x-contain">
        <div className="flex w-max min-w-max gap-5 p-4 md:gap-6 md:p-5">
            {rounds.map((round) => (
                <RoundColumn key={round.id} round={round} matchById={matchById} />
            ))}
        </div>
    </div>
);

const RoundList = ({
    rounds,
    matchById,
}: {
    rounds: readonly TournamentRound[];
    matchById: ReadonlyMap<string, TournamentMatch>;
}) => (
    <div className="grid gap-4">
        {rounds.map((round) => (
            <section
                key={round.id}
                className="rounded-lg border border-white/10 bg-slate-900/70 p-3"
            >
                <div className="mb-3 flex items-end justify-between gap-3">
                    <h3 className="text-base font-bold text-slate-100">{round.name}</h3>
                    <p className="text-xs font-bold text-slate-500">{round.matches.length} 試合</p>
                </div>

                <div className="grid gap-3">
                    {round.matches.map((match) => (
                        <MatchCard
                            key={match.id}
                            match={match}
                            matchById={matchById}
                            compact
                        />
                    ))}
                </div>
            </section>
        ))}
    </div>
);

const EmptyState = ({ message }: { message: string }) => (
    <div className="rounded-lg border border-dashed border-white/15 bg-slate-900/50 px-4 py-12 text-center">
        <p className="text-sm font-bold text-slate-300">{message}</p>
    </div>
);

export const TournamentBracket = ({
    rounds,
    className = '',
    emptyMessage = '表示できる試合予定がありません。',
    mobileHelpText = '表示を切り替えると、横スクロールのトーナメント表でも確認できます。',
}: TournamentBracketProps) => {
    const [mobileViewMode, setMobileViewMode] = useState<MobileViewMode>('list');
    const matchById = useMemo(() => createTournamentMatchMap(rounds), [rounds]);

    if (rounds.length === 0) {
        return <EmptyState message={emptyMessage} />;
    }

    return (
        <div className={`grid min-w-0 max-w-full gap-3 ${className}`.trim()}>
            <div className="grid gap-3 md:hidden">
                <MobileViewToggle
                    viewMode={mobileViewMode}
                    onChangeViewMode={setMobileViewMode}
                />
                <p className="text-xs leading-relaxed font-bold text-slate-500">
                    {mobileHelpText}
                </p>
            </div>

            <div className="hidden min-w-0 max-w-full md:block">
                <BracketBoard rounds={rounds} matchById={matchById} />
            </div>

            <div className="min-w-0 max-w-full md:hidden">
                <AnimatePresence mode="wait">
                    {mobileViewMode === 'list' ? (
                        <motion.div
                            key="mobile-list"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                            className="min-w-0 max-w-full"
                        >
                            <RoundList rounds={rounds} matchById={matchById} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="mobile-board"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                            className="min-w-0 max-w-full"
                        >
                            <BracketBoard rounds={rounds} matchById={matchById} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
