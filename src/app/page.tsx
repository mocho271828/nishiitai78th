'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, MapPin, Calendar, Trophy, Info, Clover, Compass, BadgeQuestionMark, Newspaper, ChessQueen, BookAlert, CalendarDays } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import HeroImage from './images/sample-arena.jpg';
import styles from './page.module.css';

// --- Hero Section Component ---
const HeroSection = () => {
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 1000], [0, 200]);
  const yText = useTransform(scrollY, [0, 500], [0, 100]);
  const opacityText = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className={styles.section}>
      {/* Background Image with Parallax */}
      <motion.div
        style={{ y: yBg }}
        className={styles.bgImageContainer}
      >
        <div className={styles.bgImageWrapper}> {/* Slightly larger for parallax */}
          <Image
            src={HeroImage}
            alt="架空の大会会場"
            fill
            priority
            className="object-cover"
            quality={100}
            placeholder="blur"
          />
        </div>
      </motion.div>

      {/* Modern Gradient Overlays for Readability & Mood */}
      <div className={styles.overlayGradient} />
      <div className={styles.overlayRadial} />

      {/* Main Content */}
      <motion.div
        style={{ y: yText, opacity: opacityText }}
        className={styles.contentWrapper}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className={styles.contentInner}
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className={styles.subtitle}
          >
            運営引き継ぎ用の架空大会
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={styles.title}
          >
            <span className={styles.gradientText}>
              学生スポーツ大会
            </span><br />
            <span className={styles.gradientText}>
              公開サンプル
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className={styles.buttonGroup}
          >
            <Link href="/news" className={styles.condolenceLink}>
              大会のお知らせ
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            className={styles.buttonGroup}
            style={{ marginTop: '1.25rem' }}
          >
            <Link href="/tournament" className={styles.linkButton}>
              競技結果
            </Link>
            <Link href="/games" className={styles.linkButton}>
              大会要項
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>


      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className={styles.scrollIndicator}
      >
        <span className={styles.scrollText}>SCROLL</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown size={24} />
        </motion.div>
      </motion.div>
    </section>
  );
};

// --- Features Grid Component ---
const Features = () => {
  const features = [
    { title: 'GAMES', desc: '収録競技のスケジュールと詳細', icon: <Trophy size={32} className={styles.textBlue} />, href: '/games' },
    { title: 'TOURNAMENT', desc: '大会結果', icon: <ChessQueen size={32} className={styles.textBlue} />, href: '/tournament' },
    { title: 'VENUES', desc: '各会場へのアクセス・マップ', icon: <MapPin size={32} className={styles.textBlue} />, href: '/venues' },
    { title: 'SCHEDULE', desc: '大会期間中のタイムテーブル', icon: <Calendar size={32} className={styles.textBlue} />, href: '/schedule' },
    { title: 'GUIDE', desc: '会場周辺の案内例', icon: <Info size={32} className={styles.textBlue} />, href: '/guide' },
    { title: 'IMPORTANT', desc: '重要なお知らせ', icon: <BookAlert size={32} className={styles.textRed} />, href: '/important' },
    { title: 'council', desc: '評議会', icon: <Clover size={32} className={styles.textRed} />, href: '/council' },
    { title: 'board', desc: '理事会', icon: <Compass size={32} className={styles.textRed} />, href: '/board' },
    { title: 'CONTACT', desc: '問い合わせ', icon: <BadgeQuestionMark size={32} className={styles.textBlue} />, href: '/contact' },
    { title: 'NEWS', desc: 'お知らせ', icon: <Newspaper size={32} className={styles.textBlue} />, href: '/news' },
    { title: 'ENTRY', desc: '参加受付の案内例', icon: <CalendarDays size={32} className={styles.textBlue} />, href: '/entry' },
    { title: 'STAY INFO', desc: '宿泊・弁当の当日案内', icon: <CalendarDays size={32} className={styles.textRed} />, href: '/accommodation' }
  ];

  return (
    <section className={styles.featuresSection} id="games">
      <div className={styles.container}>
        <div className={styles.grid}>
          {features.map((feature, idx) => (
            <Link key={idx} href={feature.href}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                whileHover={{ y: -10, backgroundColor: 'rgba(30, 41, 59, 1)' }}
                className={styles.card}
              >
                <div className={styles.iconWrapper}>{feature.icon}</div>
                <h3 className={styles.cardTitle}>{feature.title}</h3>
                <p className={styles.cardDesc}>{feature.desc}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Main Page Component ---
export default function Home() {
  return (
    <main className={styles.main}>
      <HeroSection />
      <Features />
    </main>
  );
}
