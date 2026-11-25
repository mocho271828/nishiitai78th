import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/libs/firebase';
import { useWhitelist } from '@/hooks/useWhitelist';
import { useBoardlist } from '@/hooks/useBoardlist';

export const useContentAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [authLoading, setAuthLoading] = useState(auth !== null);

    useEffect(() => {
        if (!auth) return;
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setAuthLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const { isAllowed: isWhitelistUser, loading: whitelistLoading } = useWhitelist(user?.email);
    const { isAllowed: isBoardlistUser, loading: boardlistLoading } = useBoardlist(user?.email);

    const loading = authLoading || (user ? (whitelistLoading || boardlistLoading) : false);

    const canView = (authRequirement: string | undefined | null): boolean => {
        if (!authRequirement) return true; // empty / none
        if (authRequirement === 'login') return !!user;
        if (authRequirement === 'whitelist') return isWhitelistUser;
        if (authRequirement === 'boardlist') return isBoardlistUser;
        return false;
    };

    const filterContents = <T extends { auth?: string }>(items: T[]): T[] => {
        return items.filter(item => canView(item.auth));
    };

    return {
        user,
        loading,
        canView,
        filterContents,
        isWhitelistUser,
        isBoardlistUser
    };
};
