import tournamentResultJson from '../tournament/data/result.json';
import tournamentScheduleData from '../tournament/data/schedule.json';

export type TournamentScheduleData = typeof tournamentScheduleData;
export type TournamentId = keyof TournamentScheduleData;
export type Tournament = TournamentScheduleData[TournamentId];
export type TournamentRound = Tournament['rounds'][number];
export type TournamentMatch = TournamentRound['matches'][number];
export type TournamentTeam = TournamentMatch['teams'][number];

export type TournamentMatchStatus = 'SCHEDULED' | 'LIVE' | 'FINISHED';
export type TournamentResultStatus = Exclude<TournamentMatchStatus, 'SCHEDULED'>;
export type TournamentScoreLabel = 'T' | 'F' | `PK${number}`;

export type TournamentResultTeam = {
    id: string;
    name: string;
    univ: string;
    score?: number;
    scoreLabel?: TournamentScoreLabel;
    isWinner?: boolean;
};

export type TournamentResultMatch = {
    id: string;
    nextMatchId?: string | null;
    startTime?: string;
    status: TournamentResultStatus;
    teams: [TournamentResultTeam, TournamentResultTeam];
};

export type TournamentResultRound = {
    id: string;
    name: string;
    matches: TournamentResultMatch[];
};

export type TournamentResult = {
    name: string;
    rounds: TournamentResultRound[];
};

export type TournamentEntry = {
    id: TournamentId;
    tournament: Tournament;
};

export type TournamentResultEntry = {
    id: TournamentId;
    tournament: TournamentResult;
};

type TeamResultData = {
    name?: string;
    univ?: string;
    score?: number;
    scoreLabel?: string;
    isWinner?: boolean;
};

type MatchResultData = {
    status: string;
    teamResults: Record<string, TeamResultData | undefined>;
    winnerId?: string;
};

type TournamentResultData = Partial<
    Record<TournamentId, Record<string, MatchResultData | undefined>>
>;

const PENALTY_SCORE_LABEL_PATTERN = /^PK(?:0|[1-9]\d*)$/;

const isPenaltyScoreLabel = (value: string): value is `PK${number}` =>
    PENALTY_SCORE_LABEL_PATTERN.test(value) &&
    Number.isSafeInteger(Number(value.slice(2)));

const isTournamentScoreLabel = (value: string): value is TournamentScoreLabel =>
    value === 'T' || value === 'F' || isPenaltyScoreLabel(value);

const tournamentResultData: TournamentResultData = tournamentResultJson;

const GAME_TOURNAMENT_IDS: Partial<Record<string, readonly TournamentId[]>> = {
    '7': ['basketball-men'],
    '11': ['table-tennis-men', 'table-tennis-women'],
};

// 勝ち上がり構造が未確定の競技結果を、仮のトーナメント表として公開しない。
const GAME_RESULT_TOURNAMENT_IDS: Partial<
    Record<string, readonly TournamentId[]>
> = {
    ...GAME_TOURNAMENT_IDS,
    '18': ['karate-kumite-men'],
};

export const TOURNAMENT_IDS = Object.values(GAME_TOURNAMENT_IDS).flatMap(
    (tournamentIds) => tournamentIds ?? [],
);

const MATCH_STATUSES: readonly TournamentMatchStatus[] = ['SCHEDULED', 'LIVE', 'FINISHED'];

const isTournamentId = (id: string): id is TournamentId =>
    Object.prototype.hasOwnProperty.call(tournamentScheduleData, id);

const isTournamentMatchStatus = (status: string): status is TournamentMatchStatus =>
    MATCH_STATUSES.some((candidate) => candidate === status);

const validateTournamentResultData = (): void => {
    Object.entries(tournamentResultData).forEach(([tournamentId, matchResults]) => {
        if (!isTournamentId(tournamentId) || !matchResults) {
            throw new Error(`Unknown tournament result id: ${tournamentId}`);
        }

        const scheduleMatchById = createTournamentMatchMap(
            tournamentScheduleData[tournamentId].rounds,
        );

        Object.entries(matchResults).forEach(([matchId, matchResult]) => {
            if (!matchResult) {
                return;
            }

            const scheduleMatch = scheduleMatchById.get(matchId);
            if (!scheduleMatch) {
                throw new Error(`Unknown tournament match result id: ${matchId}`);
            }
            if (!isTournamentMatchStatus(matchResult.status)) {
                throw new Error(`Unknown tournament match status: ${matchResult.status}`);
            }

            const scheduleTeamIds = scheduleMatch.teams.map((team) => team.id).sort();
            const resultTeamIds = Object.keys(matchResult.teamResults).sort();
            if (
                scheduleTeamIds.length !== resultTeamIds.length ||
                scheduleTeamIds.some((teamId, index) => teamId !== resultTeamIds[index])
            ) {
                throw new Error(`Tournament result teams do not match schedule: ${matchId}`);
            }

            const teamResults = resultTeamIds.map(
                (teamId) => matchResult.teamResults[teamId],
            );
            teamResults.forEach((teamResult) => {
                if (
                    teamResult?.score !== undefined &&
                    (!Number.isInteger(teamResult.score) || teamResult.score < 0)
                ) {
                    throw new Error(`Invalid tournament score: ${matchId}`);
                }
                if (
                    teamResult?.scoreLabel !== undefined &&
                    !isTournamentScoreLabel(teamResult.scoreLabel)
                ) {
                    throw new Error(`Invalid tournament score label: ${matchId}`);
                }
                if (
                    teamResult?.score !== undefined &&
                    teamResult.scoreLabel !== undefined
                ) {
                    throw new Error(`Conflicting tournament score values: ${matchId}`);
                }
                if (
                    (teamResult?.scoreLabel === 'T' && teamResult.isWinner !== true) ||
                    (teamResult?.scoreLabel === 'F' && teamResult.isWinner !== false)
                ) {
                    throw new Error(`Tournament score label does not match winner: ${matchId}`);
                }
            });

            if (matchResult.status === 'FINISHED') {
                const scoreCount = teamResults.filter(
                    (teamResult) => teamResult?.score !== undefined,
                ).length;
                const scoreLabelCount = teamResults.filter(
                    (teamResult) => teamResult?.scoreLabel !== undefined,
                ).length;
                const winnerCount = teamResults.filter(
                    (teamResult) => teamResult?.isWinner === true,
                ).length;
                const loserCount = teamResults.filter(
                    (teamResult) => teamResult?.isWinner === false,
                ).length;

                if (
                    (scoreCount !== 0 && scoreCount !== teamResults.length) ||
                    (scoreLabelCount !== 0 && scoreLabelCount !== teamResults.length) ||
                    (scoreCount > 0 && scoreLabelCount > 0) ||
                    winnerCount !== 1 ||
                    loserCount !== 1
                ) {
                    throw new Error(`Incomplete finished tournament result: ${matchId}`);
                }

                if (scoreLabelCount === teamResults.length) {
                    const firstScoreLabel = teamResults[0]?.scoreLabel;
                    const secondScoreLabel = teamResults[1]?.scoreLabel;
                    const isTechnicalDecision =
                        (firstScoreLabel === 'T' && secondScoreLabel === 'F') ||
                        (firstScoreLabel === 'F' && secondScoreLabel === 'T');
                    const isPenaltyShootout =
                        firstScoreLabel !== undefined &&
                        secondScoreLabel !== undefined &&
                        isPenaltyScoreLabel(firstScoreLabel) &&
                        isPenaltyScoreLabel(secondScoreLabel);

                    if (!isTechnicalDecision && !isPenaltyShootout) {
                        throw new Error(
                            `Invalid finished tournament score label pair: ${matchId}`,
                        );
                    }

                    if (isPenaltyShootout) {
                        const winnerScoreLabel = teamResults.find(
                            (teamResult) => teamResult?.isWinner === true,
                        )?.scoreLabel;
                        const loserScoreLabel = teamResults.find(
                            (teamResult) => teamResult?.isWinner === false,
                        )?.scoreLabel;

                        if (
                            winnerScoreLabel === undefined ||
                            loserScoreLabel === undefined ||
                            !isPenaltyScoreLabel(winnerScoreLabel) ||
                            !isPenaltyScoreLabel(loserScoreLabel) ||
                            Number(winnerScoreLabel.slice(2)) <=
                                Number(loserScoreLabel.slice(2))
                        ) {
                            throw new Error(
                                `Tournament penalty score does not match winner: ${matchId}`,
                            );
                        }
                    }
                }
            } else if (
                matchResult.status === 'LIVE' &&
                teamResults.some((teamResult) => teamResult?.isWinner !== undefined)
            ) {
                throw new Error(`Live tournament result cannot declare a winner: ${matchId}`);
            }
        });
    });
};

const resolveTournamentSlot = (
    team: TournamentTeam,
    resolvedMatchById: ReadonlyMap<string, TournamentResultMatch>,
): TournamentTeam => {
    // 2回戦以降の仮枠名は、上流試合の明示的な勝敗結果から表示名へ置き換える。
    const slotReference = team.id.match(/^(.*)_(winner|loser)_(.+)$/);
    if (!slotReference) {
        return team;
    }

    const [, prefix, outcome, sourceReference] = slotReference;
    const sourceMatch = resolvedMatchById.get(`${prefix}_m_${sourceReference}`);
    if (sourceMatch?.status !== 'FINISHED') {
        return team;
    }

    const sourceTeam = sourceMatch.teams.find(
        (candidate) => candidate.isWinner === (outcome === 'winner'),
    );

    if (!sourceTeam) {
        return team;
    }

    return {
        ...team,
        name: sourceTeam.name,
        univ: sourceTeam.univ,
    };
};

const createTournamentResultTeam = (
    team: TournamentTeam,
    teamResult: TeamResultData | undefined,
): TournamentResultTeam => {
    const scoreLabel = teamResult?.scoreLabel;

    return {
        ...team,
        name: teamResult?.name ?? team.name,
        univ: teamResult?.univ ?? team.univ,
        score: teamResult?.score,
        scoreLabel:
            scoreLabel !== undefined && isTournamentScoreLabel(scoreLabel)
                ? scoreLabel
                : undefined,
        isWinner: teamResult?.isWinner,
    };
};

const createResolvedTournament = (id: TournamentId): Tournament => {
    const tournament = structuredClone(tournamentScheduleData[id]);
    const matchResults = tournamentResultData[id] ?? {};
    const resolvedMatchById = new Map<string, TournamentResultMatch>();

    tournament.rounds.forEach((round) => {
        round.matches.forEach((match) => {
            const matchResult = matchResults[match.id];
            const firstTeam = resolveTournamentSlot(match.teams[0], resolvedMatchById);
            const secondTeam = resolveTournamentSlot(match.teams[1], resolvedMatchById);

            const teams: [TournamentResultTeam, TournamentResultTeam] = [
                createTournamentResultTeam(
                    firstTeam,
                    matchResult?.teamResults[firstTeam.id],
                ),
                createTournamentResultTeam(
                    secondTeam,
                    matchResult?.teamResults[secondTeam.id],
                ),
            ];

            match.teams[0].name = teams[0].name;
            match.teams[0].univ = teams[0].univ;
            match.teams[1].name = teams[1].name;
            match.teams[1].univ = teams[1].univ;

            if (!matchResult) {
                return;
            }
            if (!isTournamentMatchStatus(matchResult.status)) {
                throw new Error(`Unknown tournament match status: ${matchResult.status}`);
            }
            if (matchResult.status === 'SCHEDULED') {
                return;
            }

            resolvedMatchById.set(match.id, {
                id: match.id,
                nextMatchId: match.nextMatchId,
                startTime: match.startTime,
                status: matchResult.status,
                teams,
            });
        });
    });

    return tournament;
};

const resolvedTournamentById = new Map<TournamentId, Tournament>();

export const getTournamentById = (id: TournamentId): Tournament => {
    const cachedTournament = resolvedTournamentById.get(id);
    if (cachedTournament) {
        return cachedTournament;
    }

    const tournament = createResolvedTournament(id);
    resolvedTournamentById.set(id, tournament);
    return tournament;
};

export const getTournamentEntriesForGameId = (gameId: string): TournamentEntry[] => {
    const tournamentIds = GAME_TOURNAMENT_IDS[gameId] ?? [];

    return tournamentIds.map((id) => ({
        id,
        tournament: getTournamentById(id),
    }));
};

const createTournamentResult = (id: TournamentId): TournamentResult => {
    const tournament = getTournamentById(id);
    const matchResults = tournamentResultData[id] ?? {};

    const rounds = tournament.rounds.flatMap<TournamentResultRound>((round) => {
        const matches = round.matches.flatMap<TournamentResultMatch>((match) => {
            const matchResult = matchResults[match.id];
            if (!matchResult) {
                return [];
            }
            if (!isTournamentMatchStatus(matchResult.status)) {
                throw new Error(`Unknown tournament match status: ${matchResult.status}`);
            }
            if (matchResult.status === 'SCHEDULED') {
                return [];
            }

            const resultMatch: TournamentResultMatch = {
                id: match.id,
                nextMatchId: match.nextMatchId,
                startTime: match.startTime,
                status: matchResult.status,
                teams: [
                    createTournamentResultTeam(
                        match.teams[0],
                        matchResult.teamResults[match.teams[0].id],
                    ),
                    createTournamentResultTeam(
                        match.teams[1],
                        matchResult.teamResults[match.teams[1].id],
                    ),
                ],
            };

            return [resultMatch];
        });

        return matches.length > 0
            ? [{ id: round.id, name: round.name, matches }]
            : [];
    });

    return { name: tournament.name, rounds };
};

export const getTournamentResultEntriesForGameId = (
    gameId: string,
): TournamentResultEntry[] => {
    const tournamentIds = GAME_RESULT_TOURNAMENT_IDS[gameId] ?? [];

    return tournamentIds.map((id) => ({
        id,
        tournament: createTournamentResult(id),
    }));
};

export const createTournamentMatchMap = (
    rounds: readonly TournamentRound[],
): ReadonlyMap<string, TournamentMatch> => {
    const matchById = new Map<string, TournamentMatch>();

    rounds.forEach((round) => {
        round.matches.forEach((match) => {
            matchById.set(match.id, match);
        });
    });

    return matchById;
};

export const getTournamentTotalMatches = (rounds: readonly TournamentRound[]): number =>
    rounds.reduce((total, round) => total + round.matches.length, 0);

validateTournamentResultData();
