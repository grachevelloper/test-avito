import {useCallback, useEffect} from 'react';

import {useLocalStorage} from '@/shared/hooks/useLocalStorage';

export type Theme = 'light' | 'dark' | 'auto';

export const useTheme = () => {
    const [theme, setTheme] = useLocalStorage<Theme>('theme', 'auto');
    const [resolvedTheme, setResolvedTheme] = useLocalStorage<'light' | 'dark'>('resolved-theme', 'light');

    const getSystemTheme = useCallback((): 'light' | 'dark' => {
        if (typeof window !== 'undefined') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return 'light';
    }, []);

    const applyTheme = useCallback((newTheme: Theme) => {
        const actualTheme = newTheme === 'auto' ? getSystemTheme() : newTheme;
    
        document.documentElement.setAttribute('data-theme', actualTheme);
        document.documentElement.style.colorScheme = actualTheme;
    
        setResolvedTheme(actualTheme);
    }, [getSystemTheme, setResolvedTheme]);

    useEffect(() => {
        applyTheme(theme);
    }, [theme, applyTheme]);

    useEffect(() => {
        if (theme !== 'auto') return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
        const handleChange = () => {
            applyTheme('auto');
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme, applyTheme]);

    const toggleTheme = useCallback(() => {
        setTheme(current => {
            if (current === 'light') return 'dark';
            if (current === 'dark') return 'auto';
            return 'light';
        });
    }, [setTheme]);

    return {
        resolvedTheme,
        toggleTheme,
    };
};