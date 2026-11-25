'use client';

import React, { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './InstallPWA.module.css';

// Define BeforeInstallPromptEvent interface as it is not standard yet
interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const InstallPWA = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // PWAインストール可能な状態になったら発火するイベント
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setIsVisible(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;

        if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
        }
        setDeferredPrompt(null);
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className={styles.popup}
                >
                    <div className={styles.iconWrapper}>
                        <Download size={24} />
                    </div>
                    <div className={styles.content}>
                        <h4 className={styles.title}>アプリをインストール</h4>
                        <p className={styles.description}>オフラインでも競技結果を確認可能です.</p>
                    </div>
                    <div className={styles.actions}>
                        <button
                            onClick={handleInstallClick}
                            className={styles.installButton}
                        >
                            追加
                        </button>
                        <button
                            onClick={() => setIsVisible(false)}
                            className={styles.closeButton}
                        >
                            <X size={16} />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
