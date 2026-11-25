export type CompetitionProgramDocument = {
    readonly id: 'schedule' | 'rules';
    readonly label: string;
    readonly href: string;
    readonly downloadFileName: string;
    readonly pageCount: number;
};

export type CompetitionProgram = {
    readonly sportName: string;
    readonly documents: readonly CompetitionProgramDocument[];
};

const documentDirectory = '/~nisiitai/78th/file/game-programs/basketball';

const programs = new Map<string, CompetitionProgram>([
    ['7', {
        sportName: 'バスケットボール男子',
        documents: [
            {
                id: 'schedule',
                label: '進行表',
                href: `${documentDirectory}/schedule.pdf`,
                downloadFileName: 'サンプル_バスケットボール男子_進行表.pdf',
                pageCount: 1,
            },
            {
                id: 'rules',
                label: '細則',
                href: `${documentDirectory}/rules.pdf`,
                downloadFileName: 'サンプル_バスケットボール男子_細則.pdf',
                pageCount: 1,
            },
        ],
    }],
]);

export const getCompetitionProgram = (gameId: string): CompetitionProgram | null =>
    programs.get(gameId) ?? null;
