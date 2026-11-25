'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CircleCheck } from 'lucide-react';
import Link from 'next/link';
import styles from './entry.module.css';

const EntryPage = () => {
  const tournamentLinks = [
    {
      title: '競技情報',
      description: '各競技の日程、会場、組み合わせなどをご確認いただけます。',
      href: '/games',
    },
    {
      title: '会場案内',
      description: '大会期間中に利用する各競技会場の場所をご確認いただけます。',
      href: '/venues',
    },
    {
      title: 'お問い合わせ',
      description: '登録内容に関する確認や大会期間中のご連絡はこちらをご利用ください。',
      href: '/contact',
    },
  ];

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          ENTRY
        </motion.h1>
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          エントリー
        </motion.p>
      </div>

      <div className={styles.container}>
        <div className={styles.notice} role="status">
          <CircleCheck size={28} className={styles.noticeIcon} aria-hidden="true" />
          <div>
            <h2 className={styles.noticeTitle}>参加受付の案内例</h2>
            <p className={styles.noticeDescription}>
              サンプル大会の日程・会場・問い合わせ案内を確認できます。この見本では参加申込を受け付けていません。
            </p>
          </div>
        </div>

        <div className={styles.grid}>
          {tournamentLinks.map((tournamentLink, index) => (
            <motion.div
              key={tournamentLink.href}
              className={styles.card}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <h2 className={styles.cardTitle}>{tournamentLink.title}</h2>
              <p className={styles.cardDescription}>{tournamentLink.description}</p>

              <Link
                href={tournamentLink.href}
                className={styles.entryButton}
              >
                確認する
                <ArrowRight size={16} className={styles.buttonIcon} aria-hidden="true" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default EntryPage;
