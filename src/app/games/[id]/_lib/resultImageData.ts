export type CompetitionResultImage = {
    readonly src: string;
    readonly alt: string;
    readonly caption: string;
    readonly width: number;
    readonly height: number;
};

export type CompetitionResultImageSet = {
    readonly sportName: string;
    readonly images: readonly CompetitionResultImage[];
};

const resultImages = new Map<string, CompetitionResultImageSet>([
    ['13', {
        sportName: '柔道',
        images: [
            {
                src: '/~nisiitai/78th/images/game-results/judo/sample-result.jpg',
                alt: '柔道団体戦の架空結果。優勝はサンプル大学B、準優勝はサンプル大学A。',
                caption: '団体戦 決勝（サンプル）',
                width: 1400,
                height: 900,
            },
        ],
    }],
]);

export const getCompetitionResultImageSet = (gameId: string): CompetitionResultImageSet | null =>
    resultImages.get(gameId) ?? null;
