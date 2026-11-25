'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';
import { getBlob, getStorage, ref } from 'firebase/storage';
import { app } from '@/libs/firebase';

interface SecureDownloadButtonProps {
    storageFilePath: string;
    downloadFileName: string;
}

export default function SecureDownloadButton({ storageFilePath, downloadFileName }: SecureDownloadButtonProps) {
    const [isDownloading, setIsDownloading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const download = async () => {
        if (!app || isDownloading) return;
        setIsDownloading(true);
        setErrorMessage('');
        try {
            // 限定添付は現在のユーザーの権限で取得し、共有用URLを生成しない。
            const pdf = await getBlob(ref(getStorage(app), storageFilePath));
            const signature = await pdf.slice(0, 5).text();
            if (signature !== '%PDF-') {
                setErrorMessage('PDF形式のファイルを取得できませんでした。');
                return;
            }
            const url = URL.createObjectURL(pdf);
            const link = document.createElement('a');
            link.href = url;
            link.download = downloadFileName;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.setTimeout(() => URL.revokeObjectURL(url), 0);
        } catch {
            setErrorMessage('資料を取得できませんでした。閲覧権限と接続をご確認ください。');
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <>
            <button type="button" disabled={!app || isDownloading} onClick={download}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors border border-blue-500 disabled:opacity-50">
                <Download className="w-4 h-4 mr-2" />
                {isDownloading ? '取得中…' : 'ダウンロード'}
            </button>
            {errorMessage && <p role="status" className="mt-2 text-sm">{errorMessage}</p>}
        </>
    );
}
