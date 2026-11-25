'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, Star, ChevronLeft, Filter, X } from 'lucide-react';
import BoardGuard from '@/components/auth/BoardlistGuard';
import { GAME_DATES, GAME_VENUES, GAMES_DATA } from '../../libs/games_data';

// --- Types & Data ---

type EventType = 'CEREMONY' | 'GAME' | 'EVENT';

const CATEGORIES = GAMES_DATA.map((game) => game.name);

interface ScheduleEvent {
    time: string;
    title: string;
    location: string;
    type: EventType;
    categories?: string[]; // Array of related categories for filtering
}

interface DaySchedule {
    date: string;
    day: string; // "Day 1", "Day 2", etc.
    events: ScheduleEvent[];
}

const SCHEDULE_DATA: DaySchedule[] = GAME_DATES.map((date, index) => {
    const events: ScheduleEvent[] = GAMES_DATA
        .filter((game) => game.date === date)
        .map((game) => ({
            time: '09:00–17:00',
            title: game.name,
            location: game.location,
            type: 'GAME',
            categories: [game.name],
        }));

    if (date === GAME_DATES[0]) {
        events.unshift(
            { time: '08:00', title: '受付', location: GAME_VENUES.gym, type: 'EVENT' },
            { time: '08:30', title: '開会式', location: GAME_VENUES.gym, type: 'CEREMONY' },
        );
    }
    return { date, day: `Day ${index + 1}`, events };
});

// --- Components ---

const EventCard = ({ event, filterCategory }: { event: ScheduleEvent, filterCategory?: string }) => {
    const getBorderColor = (type: EventType) => {
        switch (type) {
            case 'CEREMONY': return 'border-yellow-500/50 bg-yellow-900/10';
            case 'GAME': return 'border-blue-500/50 bg-blue-900/10';
            default: return 'border-slate-700 bg-slate-800';
        }
    };

    const getIcon = (type: EventType) => {
        switch (type) {
            case 'CEREMONY': return <Star size={16} className="text-yellow-500" />;
            case 'GAME': return <Calendar size={16} className="text-blue-500" />;
            case 'EVENT': return <Clock size={16} className="text-slate-400" />;
        }
    };

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className={`flex flex-col md:flex-row gap-4 p-4 rounded-xl border ${getBorderColor(event.type)} backdrop-blur-sm transition-colors mb-4`}
        >
            <div className="flex items-center gap-3 md:w-48 flex-shrink-0">
                <div className="p-2 rounded-full bg-slate-900/50 border border-slate-700">
                    {getIcon(event.type)}
                </div>
                <span className="font-mono text-sm text-slate-300 font-bold">{event.time}</span>
            </div>

            <div className="flex-1">
                <h4 className="text-lg font-bold text-white mb-2">{event.title}</h4>
                {event.categories && event.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                        {event.categories.map(cat => {
                            const isMatched = filterCategory !== 'ALL' && cat === filterCategory;
                            return (
                                <span
                                    key={cat}
                                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition-colors ${isMatched
                                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/50'
                                            : 'bg-white/5 text-slate-300 border-white/10'
                                        }`}
                                >
                                    {cat}
                                </span>
                            );
                        })}
                    </div>
                )}
                <div className="flex items-center gap-2 text-xs text-slate-400">
                    <MapPin size={12} />
                    {event.location}
                </div>
            </div>
        </motion.div>
    );
};

const DaySection = ({ daySchedule, index, filterCategory }: { daySchedule: DaySchedule, index: number, filterCategory: string }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="mb-12 relative pl-8 md:pl-0"
        >
            {/* Timeline Line (Desktop only) */}
            <div className="hidden md:block absolute left-[8.5rem] top-0 bottom-0 w-px bg-slate-800 -z-10" />

            <div className="flex flex-col md:flex-row gap-8">
                {/* Date Column */}
                <div className="md:w-32 flex-shrink-0 flex flex-col items-start md:items-end text-right">
                    <div className="sticky top-24">
                        <span className="text-3xl font-bold text-slate-200 block">{daySchedule.day}</span>
                        <span className="text-xs font-mono text-slate-500 block mt-1">{daySchedule.date}</span>
                        <div className="hidden md:block absolute top-4 right-[-2.3rem] w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                    </div>
                </div>

                {/* Events Column */}
                <div className="flex-1">
                    {daySchedule.events.map((event, idx) => (
                        <EventCard key={idx} event={event} filterCategory={filterCategory} />
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default function SchedulePage() {
    const [filterType, setFilterType] = useState<EventType | 'ALL'>('ALL');
    const [filterCategory, setFilterCategory] = useState('ALL');

    const filteredData = useMemo(() => {
        return SCHEDULE_DATA.map(day => {
            const filteredEvents = day.events.filter(event => {
                const typeMatch = filterType === 'ALL' || event.type === filterType;

                if (filterCategory !== 'ALL') {
                    return typeMatch && event.categories?.includes(filterCategory);
                }
                return typeMatch;
            });

            return {
                ...day,
                events: filteredEvents
            };
        }).filter(day => day.events.length > 0);
    }, [filterType, filterCategory]);

    return (
        // Board メンバー用にモック
        <BoardGuard>
            <main className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500 selection:text-white">

                <div className="container mx-auto px-6 pt-24 pb-20 max-w-4xl">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-white to-blue-200">
                            schedule
                        </h2>
                        <p className="text-slate-400 text-sm">2030年9月1日から3日までの架空の日程です。</p>
                    </div>

                    {/* Filters */}
                    <div className="mb-12 space-y-4">
                        <div className="flex flex-col md:flex-row gap-4 justify-center items-center backdrop-blur-md bg-slate-900/50 p-6 rounded-2xl border border-slate-800/50">
                            <div className="flex items-center gap-2 text-slate-400 mr-4">
                                <Filter size={18} />
                                <span className="text-sm font-bold">FILTER</span>
                            </div>

                            <div className="flex flex-wrap justify-center gap-2">
                                <button
                                    onClick={() => setFilterType('ALL')}
                                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filterType === 'ALL'
                                        ? 'bg-white text-slate-900'
                                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                        }`}
                                >
                                    全て
                                </button>
                                <button
                                    onClick={() => setFilterType('GAME')}
                                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filterType === 'GAME'
                                        ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                        }`}
                                >
                                    競技
                                </button>
                                <button
                                    onClick={() => setFilterType('CEREMONY')}
                                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filterType === 'CEREMONY'
                                        ? 'bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.5)]'
                                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                        }`}
                                >
                                    式典
                                </button>
                                <button
                                    onClick={() => setFilterType('EVENT')}
                                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filterType === 'EVENT'
                                        ? 'bg-slate-500 text-white'
                                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                        }`}
                                >
                                    その他
                                </button>
                            </div>

                            {/* Separator for desktop */}
                            <div className="hidden md:block w-px h-8 bg-slate-700 mx-2" />

                            <div className="relative group">
                                <select
                                    value={filterCategory}
                                    onChange={(event) => setFilterCategory(event.target.value)}
                                    className="appearance-none bg-slate-800 text-slate-200 pl-4 pr-10 py-1.5 rounded-lg text-sm border border-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer min-w-[140px]"
                                >
                                    <option value="ALL">全ての競技種目</option>
                                    {CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <ChevronLeft size={14} className="-rotate-90" />
                                </div>
                            </div>
                        </div>

                        {(filterType !== 'ALL' || filterCategory !== 'ALL') && (
                            <div className="flex justify-center">
                                <button
                                    onClick={() => { setFilterType('ALL'); setFilterCategory('ALL'); }}
                                    className="flex items-center gap-1 text-xs text-slate-500 hover:text-white transition-colors"
                                >
                                    <X size={12} />
                                    フィルターを解除
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="relative min-h-[300px]">
                        {filteredData.length > 0 ? (
                            <>
                                {/* Timeline Line (Mobile) - Only show if we have data */}
                                <div className="md:hidden absolute left-[7px] top-4 bottom-0 w-px bg-slate-800" />

                                <AnimatePresence mode="popLayout">
                                    {filteredData.map((day, idx) => (
                                        <DaySection key={day.date} daySchedule={day} index={idx} filterCategory={filterCategory} />
                                    ))}
                                </AnimatePresence>
                            </>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-20 text-slate-500"
                            >
                                <p className="text-lg mb-2">該当するイベントが見つかりませんでした</p>
                                <p className="text-sm">条件を変更して再度お試しください</p>
                            </motion.div>
                        )}
                    </div>
                </div>
            </main>
        </BoardGuard>
    );
}
