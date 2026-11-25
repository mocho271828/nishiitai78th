import { useEmailAllowlist } from './useEmailAllowlist';

export const useBoardlist = (userEmail: string | null | undefined) =>
    useEmailAllowlist('boardlist', userEmail);
