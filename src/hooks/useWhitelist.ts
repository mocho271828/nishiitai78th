import { useEmailAllowlist } from './useEmailAllowlist';

export const useWhitelist = (userEmail: string | null | undefined) =>
    useEmailAllowlist('whitelist', userEmail);
