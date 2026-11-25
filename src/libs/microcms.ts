import { createClient, type MicroCMSQueries } from 'microcms-js-sdk';
import { z } from 'zod';
import { PUBLIC_BOARD_MINUTES_PATH, SAMPLE_BOARD_ID, SAMPLE_NEWS_ID } from '@/_constants/news';
import type { Board, Council, News } from '@/types';

const sampleDates = {
    createdAt: '2030-08-20T03:00:00Z',
    updatedAt: '2030-08-20T03:00:00Z',
    publishedAt: '2030-08-20T03:00:00Z',
};

const sampleNews: News[] = [{
    ...sampleDates,
    id: SAMPLE_NEWS_ID,
    title: '大会案内を掲載しました（サンプル）',
    content: '<p>サンプル大会の日程は9月1日から3日までです。競技一覧から、各競技の進行表と会場を確認できます。</p>',
    category: ['大会案内'],
    eyecatch: { url: '/~nisiitai/78th/images/news/sample-event.webp', width: 1200, height: 800 },
}];

const sampleBoard: Board[] = [{
    createdAt: '2030-08-26T03:00:00Z',
    updatedAt: '2030-08-26T03:00:00Z',
    publishedAt: '2030-08-26T03:00:00Z',
    id: SAMPLE_BOARD_ID,
    auth: 'whitelist',
    title: '運営会議の議事録（サンプル）',
    content: '<p>架空の運営会議で受付の開始時間と各会場の案内方法を確認しました。公開用の議事録見本を添付します。</p>',
    category: ['議事録'],
    filePath: PUBLIC_BOARD_MINUTES_PATH,
    isPublicFile: true,
}];

const sampleCouncil: Council[] = [{
    ...sampleDates,
    id: 'sample-council-agenda',
    auth: 'whitelist',
    title: '競技代表会議の議題（サンプル）',
    content: '<p>代表会議では、各競技の集合場所と試合結果を報告する手順を確認します。</p>',
    category: ['会議案内'],
}];

const cmsSettings = z.object({ serviceDomain: z.string().min(1), apiKey: z.string().min(1) });
const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN?.trim();
const apiKey = process.env.MICROCMS_API_KEY?.trim();
const settings = cmsSettings.safeParse({ serviceDomain, apiKey });
if ((serviceDomain || apiKey) && !settings.success) {
    throw new Error('microCMSを使う場合はサービスドメインとAPIキーの両方を設定してください。');
}
const client = settings.success ? createClient(settings.data) : undefined;

const articleSchema = z.object({
    id: z.string(), title: z.string(), content: z.string(), category: z.array(z.string()),
    createdAt: z.string(), updatedAt: z.string(),
    publishedAt: z.string().optional(), revisedAt: z.string().optional(),
    auth: z.string().optional(),
    filePath: z.string().optional(), storageFilePath: z.string().optional(),
    isPublicFile: z.boolean().optional(),
    eyecatch: z.object({
        url: z.string(), width: z.number().optional(), height: z.number().optional(),
    }).optional(),
});

function articles<T extends News | Board | Council>(endpoint: string, samples: T[]) {
    return {
        list: async (queries?: MicroCMSQueries) => {
            if (!client) return { contents: samples };
            const result = await client.getList<T>({ endpoint, queries });
            return { ...result, contents: articleSchema.array().parse(result.contents) };
        },
        detail: async (contentId: string, queries?: MicroCMSQueries) => {
            if (client) {
                const article = await client.getListDetail<T>({ endpoint, contentId, queries });
                return articleSchema.parse(article);
            }
            const article = samples.find((sample) => sample.id === contentId);
            if (!article) throw new Error('指定された見本記事が見つかりません。');
            return article;
        },
    };
}

export const { list: getNewsList, detail: getNewsDetail } = articles('news', sampleNews);
export const { list: getBoardList, detail: getBoardDetail } = articles('board', sampleBoard);
export const { list: getCouncilList, detail: getCouncilDetail } = articles('council', sampleCouncil);
