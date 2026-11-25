import { useEffect, useMemo, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { z } from 'zod';
import { db } from '@/libs/firebase';

type ListName = 'whitelist' | 'boardlist';

const allowlistSchema = z.object({ emails: z.array(z.string()) });

export function useEmailAllowlist(listName: ListName, userEmail: string | null | undefined) {
    // 同じメールで再ログインしても、前回の判定は引き継がない。
    const lookup = useMemo(() => ({ listName, userEmail }), [listName, userEmail]);
    const [result, setResult] = useState<{ lookup: typeof lookup; isAllowed: boolean } | null>(null);

    useEffect(() => {
        if (!db || !lookup.userEmail) return;
        const email = lookup.userEmail;
        const reference = doc(db, 'settings', lookup.listName);
        let active = true;

        async function check() {
            let isAllowed = false;
            try {
                const snapshot = await getDoc(reference);
                if (snapshot.exists()) {
                    const parsed = allowlistSchema.safeParse(snapshot.data());
                    if (parsed.success) {
                        isAllowed = parsed.data.emails.includes(email);
                    } else {
                        console.error('許可リストの emails の形式が不正です', lookup.listName);
                    }
                }
            } catch {
                console.error('許可リストを取得できませんでした', lookup.listName);
            }
            if (active) setResult({ lookup, isAllowed });
        }

        void check();
        return () => { active = false; };
    }, [lookup]);

    if (!userEmail || !db) return { isAllowed: false, loading: false };
    if (result?.lookup !== lookup) return { isAllowed: false, loading: true };
    return { isAllowed: result.isAllowed, loading: false };
}
