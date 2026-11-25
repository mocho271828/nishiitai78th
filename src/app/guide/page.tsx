'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Utensils, Camera } from 'lucide-react';
import Image from 'next/image';
import HeroImage from '../images/sample-arena.jpg';

// --- Types & Data ---

type Category = 'SIGHTSEEING' | 'FOOD';

interface GuideItem {
    id: string;
    category: Category;
    title: string;
    description: string;
    location: string;
    tags: string[];
}

const GUIDE_DATA: GuideItem[] = [
    {
        id: 'sample-plaza', category: 'SIGHTSEEING', title: 'みどり広場',
        description: '受付の向かいにある屋外休憩所です。競技の合間に利用できます。',
        location: 'サンプル会場・中央入口前', tags: ['休憩'],
    },
    {
        id: 'sample-cafe', category: 'FOOD', title: 'アリーナ食堂',
        description: '昼休みに軽食を提供する食堂の案内例です。',
        location: 'サンプル会場・交流棟1階', tags: ['昼食'],
    },
];

// --- Components ---

const GuideCard = ({ item }: { item: GuideItem }) => {
    const getIcon = (cat: Category) => {
        switch (cat) {
            case 'SIGHTSEEING': return <Camera size={18} className="text-teal-400" />;
            case 'FOOD': return <Utensils size={18} className="text-orange-400" />;

        }
    };

    const getGradient = (cat: Category) => {
        switch (cat) {
            case 'SIGHTSEEING': return 'from-teal-900/40 to-slate-900 border-teal-500/30 hover:border-teal-500';
            case 'FOOD': return 'from-orange-900/40 to-slate-900 border-orange-500/30 hover:border-orange-500';

        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className={`group relative overflow-hidden rounded-xl border bg-gradient-to-br ${getGradient(item.category)} transition-all duration-300 shadow-lg`}
        >
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/50 border border-white/10 text-xs font-bold tracking-wider text-slate-300">
                        {getIcon(item.category)}
                        {item.category}
                    </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-200 transition-colors">
                    {item.title}
                </h3>

                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    {item.description}
                </p>

                <div className="mt-auto pt-4 border-t border-white/5 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        <MapPin size={14} className="text-blue-500" />
                        {item.location}
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {item.tags.map(tag => (
                            <span key={tag} className="text-[10px] text-slate-500 px-2 py-0.5 rounded bg-slate-900 border border-slate-700">
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const SectionHeader = ({ title, icon }: { title: string, icon: React.ReactNode }) => (
    <div className="flex items-center gap-3 mb-8 mt-12 pl-4 border-l-4 border-red-500">
        {icon}
        <h2 className="text-2xl font-bold text-white tracking-widest">{title}</h2>
    </div>
);

export default function GuidePage() {
    return (
        <main className="min-h-screen bg-slate-950 text-white selection:bg-red-500 selection:text-white">

            <div className="container mx-auto px-6 pt-24 pb-20 max-w-6xl">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500">
                        会場周辺ガイド
                    </h1>
                    <p className="text-slate-400 text-lg">架空の施設を使った案内見本です。</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
                    <div className="lg:col-span-2">
                        <div className="aspect-video rounded-2xl overflow-hidden relative group">
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10" />
                            <Image
                                src={HeroImage}
                                alt="サンプル会場のイラスト"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute bottom-6 left-6 z-20">
                                <h2 className="text-2xl font-bold mb-1">サンプル会場</h2>
                                <p className="text-sm text-slate-300">周辺の休憩場所と食事の案内例</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 flex flex-col justify-center">
                        <h3 className="text-xl font-bold mb-4 text-white">ACCESS INFO</h3>
                        <p className="text-sm text-slate-400 mb-6">代表的な到着地点から、受付までの移動時間を掲載します。</p>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm border-b border-slate-800 pb-2">
                                <span className="text-slate-500">サンプル駅から徒歩</span>
                                <span className="text-white font-mono">10分</span>
                            </div>
                            <div className="flex justify-between text-sm border-b border-slate-800 pb-2">
                                <span className="text-slate-500">バス停から徒歩</span>
                                <span className="text-white font-mono">3分</span>
                            </div>
                            <div className="flex justify-between text-sm border-b border-slate-800 pb-2">
                                <span className="text-slate-500">東口から徒歩</span>
                                <span className="text-white font-mono">5分</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sightseeing Section */}
                <SectionHeader title="SIGHTSEEING" icon={<Camera size={24} className="text-teal-400" />} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {GUIDE_DATA.filter(i => i.category === 'SIGHTSEEING').map(item => (
                        <GuideCard key={item.id} item={item} />
                    ))}
                </div>

                {/* Food Section */}
                <SectionHeader title="GOURMET" icon={<Utensils size={24} className="text-orange-400" />} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {GUIDE_DATA.filter(i => i.category === 'FOOD').map(item => (
                        <GuideCard key={item.id} item={item} />
                    ))}
                </div>
            </div>
        </main>
    );
}
