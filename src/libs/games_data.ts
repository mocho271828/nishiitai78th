export type Category = 'ALL' | 'BALL GAME' | 'MARTIAL ARTS' | 'WATER/SNOW' | 'OTHERS';

export const GAME_DATES = ['2030/09/01', '2030/09/02', '2030/09/03'] as const;

export const GAME_VENUES = {
    gym: 'サンプル体育館',
    dojo: 'サンプル武道場',
    field: 'サンプル運動公園',
    water: 'サンプル水上競技場',
    court: 'サンプルテニスコート',
} as const;

export interface Game {
    id: string;
    name: string;
    enName: string;
    category: Category;
    date: (typeof GAME_DATES)[number];
    location: (typeof GAME_VENUES)[keyof typeof GAME_VENUES];
}

export const GAMES_DATA: Game[] = [
    { id: '1', name: '硬式テニス男子', enName: 'TENNIS_MEN', category: 'BALL GAME', date: GAME_DATES[1], location: GAME_VENUES.court },
    { id: '2', name: '硬式テニス女子', enName: 'TENNIS_WOMEN', category: 'BALL GAME', date: GAME_DATES[1], location: GAME_VENUES.court },
    { id: '3', name: 'バドミントン男子', enName: 'BADMINTON_MEN', category: 'BALL GAME', date: GAME_DATES[2], location: GAME_VENUES.gym },
    { id: '4', name: 'バドミントン女子', enName: 'BADMINTON_WOMEN', category: 'BALL GAME', date: GAME_DATES[2], location: GAME_VENUES.gym },
    { id: '5', name: 'サッカー', enName: 'SOCCER', category: 'BALL GAME', date: GAME_DATES[0], location: GAME_VENUES.field },
    { id: '6', name: '陸上', enName: 'ATHLETICS', category: 'OTHERS', date: GAME_DATES[2], location: GAME_VENUES.field },
    { id: '7', name: 'バスケットボール男子', enName: 'BASKETBALL_MEN', category: 'BALL GAME', date: GAME_DATES[0], location: GAME_VENUES.gym },
    { id: '8', name: 'バスケットボール女子', enName: 'BASKETBALL_WOMEN', category: 'BALL GAME', date: GAME_DATES[1], location: GAME_VENUES.gym },
    { id: '9', name: 'バレーボール男子', enName: 'VOLLEYBALL_MEN', category: 'BALL GAME', date: GAME_DATES[1], location: GAME_VENUES.gym },
    { id: '10', name: 'バレーボール女子', enName: 'VOLLEYBALL_WOMEN', category: 'BALL GAME', date: GAME_DATES[2], location: GAME_VENUES.gym },
    { id: '11', name: '卓球', enName: 'TABLE TENNIS', category: 'BALL GAME', date: GAME_DATES[1], location: GAME_VENUES.gym },
    { id: '12', name: 'ハンドボール', enName: 'HANDBALL', category: 'BALL GAME', date: GAME_DATES[2], location: GAME_VENUES.gym },
    { id: '13', name: '柔道', enName: 'JUDO', category: 'MARTIAL ARTS', date: GAME_DATES[0], location: GAME_VENUES.dojo },
    { id: '14', name: '剣道', enName: 'KENDO', category: 'MARTIAL ARTS', date: GAME_DATES[2], location: GAME_VENUES.dojo },
    { id: '15', name: '弓道男子', enName: 'ARCHERY_MEN', category: 'MARTIAL ARTS', date: GAME_DATES[1], location: GAME_VENUES.dojo },
    { id: '16', name: '弓道女子', enName: 'ARCHERY_WOMEN', category: 'MARTIAL ARTS', date: GAME_DATES[1], location: GAME_VENUES.dojo },
    { id: '17', name: '水泳', enName: 'SWIMMING', category: 'WATER/SNOW', date: GAME_DATES[1], location: GAME_VENUES.water },
    { id: '18', name: '空手', enName: 'KARATE', category: 'MARTIAL ARTS', date: GAME_DATES[2], location: GAME_VENUES.dojo },
    { id: '19', name: '男子ゴルフ', enName: 'GOLF_MEN', category: 'BALL GAME', date: GAME_DATES[1], location: GAME_VENUES.field },
    { id: '20', name: '女子ゴルフ', enName: 'GOLF_WOMEN', category: 'BALL GAME', date: GAME_DATES[1], location: GAME_VENUES.field },
    { id: '21', name: '準硬式野球', enName: 'SEMI_HARD_BASEBALL', category: 'BALL GAME', date: GAME_DATES[2], location: GAME_VENUES.field },
    { id: '22', name: 'ヨット', enName: 'YACHT', category: 'WATER/SNOW', date: GAME_DATES[0], location: GAME_VENUES.water },
    { id: '23', name: 'ボート', enName: 'BOAT', category: 'WATER/SNOW', date: GAME_DATES[2], location: GAME_VENUES.water },
    { id: '24', name: '合気道', enName: 'AIKIDO', category: 'MARTIAL ARTS', date: GAME_DATES[1], location: GAME_VENUES.dojo },
    { id: '25', name: 'ソフトテニス', enName: 'SOFT_TENNIS', category: 'BALL GAME', date: GAME_DATES[2], location: GAME_VENUES.court },
    { id: '26', name: 'ラグビー', enName: 'RUGBY', category: 'BALL GAME', date: GAME_DATES[0], location: GAME_VENUES.field },
];

export const CATEGORIES: Category[] = ['ALL', 'BALL GAME', 'MARTIAL ARTS', 'WATER/SNOW', 'OTHERS'];
