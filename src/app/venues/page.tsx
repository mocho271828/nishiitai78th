'use client';

import dynamic from 'next/dynamic';
import { MapPin } from 'lucide-react';
import { GAME_VENUES, GAMES_DATA } from '../../libs/games_data';

const VenueMap = dynamic(() => import('../../components/VenueMap'), {
    ssr: false,
    loading: () => <div className="h-[600px] w-full bg-slate-800 animate-pulse rounded-2xl flex items-center justify-center text-slate-500">会場配置図を読み込み中…</div>
});

const venues = [
    { name: GAME_VENUES.gym, north: 75, east: -62 },
    { name: GAME_VENUES.dojo, north: 75, east: 62 },
    { name: GAME_VENUES.field, north: 0, east: 0 },
    { name: GAME_VENUES.water, north: -75, east: 62 },
    { name: GAME_VENUES.court, north: -75, east: -62 },
].map((venue) => ({
    ...venue,
    description: GAMES_DATA.filter((game) => game.location === venue.name)
        .map((game) => game.name)
        .join('、'),
}));

export default function VenuesPage() {
    return (
        <main className="min-h-screen bg-slate-900 text-white py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-white mb-4">
                        会場案内
                    </h1>
                    <p className="text-slate-400">
                        架空の会場配置図です。ピンを選ぶと、その会場で行う競技を確認できます。
                    </p>
                </div>

                {/* Map Container */}
                <div className="h-[600px] w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative z-0">
                    <VenueMap venues={venues} />
                </div>

                {/* Venue List */}
                <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {venues.map((venue) => (
                        <div key={venue.name} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
                            <div className="flex items-start gap-3">
                                <MapPin className="text-blue-400 shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-bold text-lg mb-2">{venue.name}</h3>
                                    <p className="text-slate-400 text-sm">{venue.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
