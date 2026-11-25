import { Trophy } from 'lucide-react';

import type {
    TournamentResultMatch,
    TournamentResultRound,
    TournamentResultTeam,
} from '../../../_lib/tournamentData';

type TournamentResultsProps = {
    rounds: readonly TournamentResultRound[];
};

const getMatchLabel = (match: TournamentResultMatch): string =>
    match.startTime || match.id;

const getStatusStyle = (status: TournamentResultMatch['status']): string => {
    if (status === 'LIVE') {
        return 'bg-red-600 text-white';
    }

    return 'bg-emerald-950 text-emerald-300';
};

const getStatusLabel = (status: TournamentResultMatch['status']): string =>
    status === 'LIVE' ? 'LIVE' : '終了';

const ResultTeamRow = ({ team }: { team: TournamentResultTeam }) => {
    const scoreDisplay = team.scoreLabel ?? team.score ?? '-';
    const scoreDescription = team.scoreLabel
        ? team.scoreLabel
        : team.score === undefined
          ? '未定'
          : `${team.score}点`;

    return (
        <div
            className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 ${
                team.isWinner ? 'bg-yellow-400/10' : 'bg-slate-950/60'
            }`}
        >
            <div className="flex min-w-0 items-center gap-2">
                {team.isWinner && (
                    <Trophy
                        size={15}
                        className="shrink-0 text-yellow-400"
                        aria-label="勝者"
                    />
                )}
                <div className="min-w-0">
                    <p
                        className={`break-words text-sm font-bold ${
                            team.isWinner ? 'text-white' : 'text-slate-300'
                        }`}
                    >
                        {team.univ}
                    </p>
                    {team.name !== team.univ && (
                        <p className="mt-0.5 break-words text-xs text-slate-400">
                            {team.name}
                        </p>
                    )}
                </div>
            </div>
            <span
                aria-label={`${team.univ}の得点または結果: ${scoreDescription}`}
                className={`font-mono text-xl font-bold tabular-nums ${
                    team.isWinner ? 'text-yellow-300' : 'text-slate-400'
                }`}
            >
                {scoreDisplay}
            </span>
        </div>
    );
};

const ResultMatchCard = ({ match }: { match: TournamentResultMatch }) => {
    const headingId = `${match.id}-result-heading`;

    return (
        <article
            aria-labelledby={headingId}
            className="overflow-hidden rounded-xl border border-white/10 bg-slate-900 shadow-lg shadow-slate-950/20"
        >
            <header className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-2.5">
                <h4
                    id={headingId}
                    className="text-xs font-bold tracking-wide text-slate-300"
                >
                    試合 {getMatchLabel(match)}
                </h4>
                <span
                    className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-bold ${getStatusStyle(
                        match.status,
                    )}`}
                >
                    {getStatusLabel(match.status)}
                </span>
            </header>
            <div className="divide-y divide-white/10">
                <ResultTeamRow team={match.teams[0]} />
                <ResultTeamRow team={match.teams[1]} />
            </div>
        </article>
    );
};

export const TournamentResults = ({ rounds }: TournamentResultsProps) => {
    if (rounds.length === 0) {
        return (
            <div className="rounded-xl border border-dashed border-white/15 bg-slate-950/50 px-6 py-16 text-center">
                <h2 className="text-xl font-bold text-white">試合結果は準備中です</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                    結果が確定した試合から順次掲載します。
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-8">
            {rounds.map((round) => (
                <section key={round.id} aria-labelledby={`${round.id}-result-heading`}>
                    <div className="mb-3 flex items-end justify-between gap-4">
                        <h3
                            id={`${round.id}-result-heading`}
                            className="text-lg font-bold text-white"
                        >
                            {round.name}
                        </h3>
                        <p className="shrink-0 text-xs font-bold text-slate-400">
                            {round.matches.length} 試合
                        </p>
                    </div>
                    <div className="grid gap-3 lg:grid-cols-2">
                        {round.matches.map((match) => (
                            <ResultMatchCard key={match.id} match={match} />
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
};
