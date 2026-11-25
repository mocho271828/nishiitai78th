'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import membersData from './data/members.json';
import AuthGuard from '@/components/auth/AuthGuard';

interface Member {
    role: string;
    email: string;
}

export default function MembersPage() {
    const members: Member[] = membersData;

    return (
        <AuthGuard>
            <main className="min-h-screen bg-slate-950 pt-24 pb-20 px-6 font-sans selection:bg-red-500 selection:text-white">
                <div className="max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-12"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                            MEMBERS
                        </h1>
                        <p className="text-slate-400 text-lg">
                            役員連絡先の見本（架空のアドレス）
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-10 shadow-xl"
                    >
                        <div className="grid gap-6">
                            {members.map((member, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 group hover:bg-slate-800 transition-colors">
                                    <div className="flex items-center gap-4 w-full">
                                        <div className="bg-blue-500/10 p-3 rounded-full group-hover:bg-blue-500/20 transition-colors">
                                            <Mail className="text-blue-400" size={24} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-slate-400 text-xs font-medium mb-1">{member.role}</p>
                                            <span
                                                className="text-white font-bold text-base md:text-lg hover:text-blue-400 transition-colors inline-flex items-center gap-2 break-all"
                                            >
                                                {member.email}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </main>
        </AuthGuard>
    );
}
