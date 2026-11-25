import { type FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { z } from "zod";

const firebaseEnvironmentSchema = z.object({
    NEXT_PUBLIC_FIREBASE_API_KEY: z.string().trim().min(1),
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().trim().min(1).optional(),
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().trim().min(1),
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().trim().min(1),
    NEXT_PUBLIC_FIREBASE_APP_ID: z.string().trim().min(1),
});

function loadFirebaseApp(): FirebaseApp | null {
    const environment = {
        NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || undefined,
    };
    // 公開見本は外部サービスなしで動く。設定の一部だけを入力した場合は誤設定として通知する。
    if (!Object.values(environment).some(Boolean)) return null;
    const parsed = firebaseEnvironmentSchema.safeParse(environment);
    if (!parsed.success) {
        const missing = parsed.error.issues.map(issue => issue.path.join('.'));
        throw new Error(`Firebase の設定を確認してください（${missing.join(', ')}）`);
    }
    return getApps().length ? getApp() : initializeApp({
        apiKey: parsed.data.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: parsed.data.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: parsed.data.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        appId: parsed.data.NEXT_PUBLIC_FIREBASE_APP_ID,
        storageBucket: parsed.data.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
}

export const app = loadFirebaseApp();
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
