import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: '西医体サイトの公開サンプル',
        short_name: '西医体サンプル',
        description: '架空の大会日程と競技データを使った引継ぎ用の見本です。',
        start_url: './',
        display: 'standalone',
        background_color: '#0f172a',
        theme_color: '#0f172a',
        orientation: 'portrait',
        icons: [{ src: './favicon.ico', sizes: 'any', type: 'image/x-icon' }],
    };
}
