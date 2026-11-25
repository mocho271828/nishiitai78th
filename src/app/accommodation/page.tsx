'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BedDouble, CalendarCheck, CircleCheck, ArrowRight, UtensilsCrossed } from 'lucide-react';
import styles from './entry.module.css';

const AccommodationPage = () => {
  const stayInformation = [
    {
      title: '宿泊',
      icon: <BedDouble size={24} aria-hidden="true" />,
      details: [
        '宿泊案内の掲載例：2030年9月1日〜2日',
        '原則チェックイン15:00以降／チェックアウト10:00まで',
        'チェックイン時に予約確認書をご提示ください',
      ],
    },
    {
      title: '昼食弁当',
      icon: <UtensilsCrossed size={24} aria-hidden="true" />,
      details: [
        '昼食案内の掲載例：2030年9月1日〜3日',
        '受取時間：11:30〜13:00（指定された引換所）',
        '当日販売はありません。受取後30分以内にお召し上がりください',
      ],
    },
    {
      title: '予約確認・変更・取消',
      icon: <CalendarCheck size={24} aria-hidden="true" />,
      details: [
        '宿泊・弁当確認書を大会当日にご持参ください',
        '予約番号を手元に用意して変更内容を確認します（記載例）',
        '受付時間は平日10:00〜17:00です',
      ],
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
          STAY INFO
        </motion.h1>
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          宿泊・弁当案内
        </motion.p>
      </div>

      <div className={styles.container}>
        <div className={styles.notice} role="status">
          <CircleCheck size={28} className={styles.noticeIcon} aria-hidden="true" />
          <div>
            <h2 className={styles.noticeTitle}>宿泊・昼食案内の見本</h2>
            <p className={styles.noticeDescription}>
              架空の日程で、予約済みの参加者に伝える確認事項を例示しています。実際の予約は受け付けていません。
            </p>
          </div>
        </div>

        <div className={styles.grid}>
          {stayInformation.map((information, index) => (
            <motion.div
              key={information.title}
              className={styles.card}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className={styles.cardHeading}>
                <span className={styles.cardIcon}>{information.icon}</span>
                <h2 className={styles.cardTitle}>{information.title}</h2>
              </div>
              <ul className={styles.detailsList}>
                {information.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className={styles.actionArea}>
          <Link
            href="/contact"
            className={styles.entryButton}
          >
            問い合わせ窓口の見本を見る
            <ArrowRight size={16} className={styles.buttonIcon} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </main>
  );
};

export default AccommodationPage;
