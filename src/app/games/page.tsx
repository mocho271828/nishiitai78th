'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, Trophy, Activity, Target } from 'lucide-react';
import Link from 'next/link';
import { Game, Category, GAMES_DATA, CATEGORIES } from '@/libs/games_data';// --- Types & Mock Data ---

// --- Components ---

const FilterTab = ({
    categories,
    activeCategory,
    setCategory
}: {
    categories: Category[],
    activeCategory: Category,
    setCategory: (c: Category) => void
}) => {
    return (
        <div className="flex flex-wrap gap-2 mb-12 justify-center">
            {categories.map((cat) => (
                <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`
            relative px-6 py-2 rounded-full text-sm font-bold tracking-wider transition-colors
            ${activeCategory === cat ? 'text-white' : 'text-slate-400 hover:text-white'}
          `}
                >
                    {activeCategory === cat && (
                        <motion.div
                            layoutId="activeTab"
                            className="absolute inset-0 bg-red-600 rounded-full"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                    <span className="relative z-10">{cat}</span>
                </button>
            ))}
        </div>
    );
};

const GameCard = ({ game }: { game: Game }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
            className="group relative overflow-hidden rounded-xl bg-slate-800 border border-slate-700 hover:border-red-500/50 transition-colors"
        >
            {/* Decorative Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 group-hover:from-red-900/20 group-hover:to-slate-900 transition-colors duration-500" />

            <Link href={`/games/${game.id}`} className="block h-full cursor-pointer relative z-10">
                <div className="p-6 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-mono text-red-400 border border-red-900/50 bg-red-900/20 px-2 py-1 rounded">
                            {game.category}
                        </span>
                        <Trophy size={16} className="text-slate-500 group-hover:text-yellow-500 transition-colors" />
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-1">{game.name}</h3>
                    <p className="text-slate-500 text-xs font-bold tracking-widest mb-6">{game.enName}</p>

                    <div className="mt-auto space-y-2 text-sm text-slate-400 relative z-20">
                        <div className="flex items-center gap-2">
                            <Activity size={14} className="text-blue-400" />
                            <span>{game.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Target size={14} className="text-blue-400" />
                            <span className="truncate">{game.location}</span>
                        </div>
                    </div>

                    {/* Hover Action Arrow */}
                    <div className="absolute bottom-6 right-6 opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                        <div className="bg-red-600 p-2 rounded-full text-white shadow-lg">
                            <ArrowRight size={16} />
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default function GamesPage() {
    const [activeCategory, setActiveCategory] = useState<Category>('ALL');
    const [searchQuery, setSearchQuery] = useState('');

    // Filtering Logic
    const filteredGames = GAMES_DATA.filter((game) => {
        const matchesCategory = activeCategory === 'ALL' || game.category === activeCategory;
        const matchesSearch = game.name.includes(searchQuery) || game.enName.includes(searchQuery.toUpperCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <main className="min-h-screen bg-slate-950 pt-24 pb-20 px-6">
            <div className="max-w-7xl mx-auto">

                {/* Page Header */}
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold text-white mb-4"
                    >
                        COMPETITIONS
                    </motion.h1>
                    <p className="text-slate-400">全{GAMES_DATA.length}種目のサンプル日程・会場を紹介します。</p>
                </div>

                {/* Search & Filter Section */}
                <div className="flex flex-col items-center mb-8">
                    <div className="relative w-full max-w-md mb-8">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500" size={20} />
                        <input
                            type="text"
                            placeholder="競技名で検索 (例: テニス)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 text-white pl-12 pr-4 py-3 rounded-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        />
                    </div>

                    <FilterTab
                        categories={CATEGORIES}
                        activeCategory={activeCategory}
                        setCategory={setActiveCategory}
                    />
                </div>

                {/* Games Grid */}
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                    <AnimatePresence mode='popLayout'>
                        {filteredGames.length > 0 ? (
                            filteredGames.map((game) => (
                                <GameCard key={game.id} game={game} />
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="col-span-full text-center py-20 text-slate-500"
                            >
                                該当する競技が見つかりません
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

            </div>
        </main>
    );
}
