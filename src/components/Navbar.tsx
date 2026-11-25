'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, LogOut, Info } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from '@/libs/firebase';
import styles from './Navbar.module.css';

export const Navbar = () => {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Auth Listener
    useEffect(() => {
        if (!auth) return;
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    // Scroll Listener
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'NEWS', href: '/news' },
        { name: 'GAMES', href: '/games' },
        { name: 'VENUES', href: '/venues' },
        { name: 'TOURNAMENT', href: '/tournament' },
        { name: 'IMPORTANT', href: '/important' },
        { name: 'STAY INFO', href: '/accommodation' },
        { name: 'CONTACT', href: '/contact' },
    ];

    const handleSignOut = async () => {
        if (!auth) return;
        try {
            await signOut(auth);
            router.push('/');
        } catch (error) {
            console.error("Sign out error", error);
        }
    };

    return (
        <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
            <Link href="/contact" className={styles.contactBanner}>
                <Info size={16} aria-hidden="true" />
                <span>公開サンプル</span>
                <strong>問い合わせ窓口の見本</strong>
            </Link>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    大会サイト <span className={styles.logoRed}>見本</span>
                </Link>

                {/* Desktop Menu */}
                <div className={styles.desktopMenu}>
                    {navLinks.map((link) => (
                        <Link key={link.name} href={link.href} className={styles.navLink}>
                            {link.name}
                            <span className={styles.underline}></span>
                        </Link>
                    ))}
                    {user ? (
                        <button
                            onClick={handleSignOut}
                            className={styles.logoutButton}
                        >
                            <LogOut size={16} />
                            LOGOUT
                            <span className={styles.underline}></span>
                        </button>
                    ) : (
                        <Link href="/login" className={styles.logoutButton}>
                            LOGIN
                            <span className={styles.underline}></span>
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className={styles.mobileMenuBtn}>
                    <button onClick={() => setIsOpen(!isOpen)} className={styles.menuBtn}>
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={styles.mobileDropdown}
                >
                    <div className={styles.mobileMenuContent}>
                        {navLinks.map((link) => (
                            <Link key={link.name} href={link.href} className={styles.mobileNavLink} onClick={() => setIsOpen(false)}>
                                {link.name}
                            </Link>
                        ))}
                        {user ? (
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    handleSignOut();
                                }}
                                className={styles.mobileLogoutBtn}
                            >
                                <LogOut size={18} />
                                LOGOUT
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                className={styles.mobileNavLink}
                                onClick={() => setIsOpen(false)}
                            >
                                LOGIN
                            </Link>
                        )}
                    </div>
                </motion.div>
            )}
        </nav>
    );
};
