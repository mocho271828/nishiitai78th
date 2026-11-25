import React from 'react';
import styles from './Footer.module.css';

export const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <p className={styles.text}>大会運営サイトの公開見本 · 架空の大会情報を掲載しています。</p>
            </div>
        </footer>
    );
};
