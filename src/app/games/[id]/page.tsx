import { GAMES_DATA } from '@/libs/games_data';
import GameDetailClient from './GameDetailClient';

export function generateStaticParams() {
    return GAMES_DATA.map((game) => ({
        id: game.id,
    }));
}

// In Next.js 15+, `params` is a Promise, so we need to await it. 
// However, the error message indicates we are on version 16.1.4, where awaiting `params` is mandatory.
export default async function GameDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;

    return <GameDetailClient id={resolvedParams.id} />;
}
