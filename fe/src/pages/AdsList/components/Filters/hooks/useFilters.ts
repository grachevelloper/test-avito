import {useCallback, useEffect, useRef} from 'react';
import {useSearchParams} from 'react-router-dom';

import {useLocalStorage} from '@/shared/hooks/useLocalStorage';

export interface FilterState {
    status: string[];
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
}

export function useFilterState(onURLChange?: (filters: FilterState) => void) {
    const [searchParams, setSearchParams] = useSearchParams();
    const [savedFilters, setSavedFilters] = useLocalStorage<Record<string, FilterState>>('savedFilters', {});
    const isInitialized = useRef(false);
    const isFirstLoad = useRef(true);

    const getFiltersFromURL = useCallback((): FilterState => {
        const status = searchParams.get('status')?.split(',') || [];
        const categoryId = searchParams.get('category') || undefined;
        const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
        const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
        const search = searchParams.get('search') || undefined;

        return {
            status: status.filter(Boolean),
            categoryId,
            minPrice,
            maxPrice,
            search,
        };
    }, [searchParams]);

    const updateURL = useCallback((filters: FilterState) => {
        if (!isInitialized.current) return;

        const params = new URLSearchParams();

        if (filters.status.length > 0) {
            params.set('status', filters.status.join(','));
        }

        if (filters.categoryId) {
            params.set('category', filters.categoryId);
        }

        if (filters.minPrice) {
            params.set('minPrice', filters.minPrice.toString());
        }

        if (filters.maxPrice) {
            params.set('maxPrice', filters.maxPrice.toString());
        }

        if (filters.search) {
            params.set('search', filters.search);
        }

        setSearchParams(params, {replace: true});
    }, [setSearchParams]);

    useEffect(() => {
        if (isFirstLoad.current) {
            isFirstLoad.current = false;
            onURLChange?.(getFiltersFromURL());
        }
    }, [getFiltersFromURL, onURLChange]);

    useEffect(() => {
        isInitialized.current = true;
    }, []);

    const saveFilterSet = useCallback((name: string, filters: FilterState) => {
        setSavedFilters(prev => ({
            ...prev,
            [name]: filters,
        }));
    }, [setSavedFilters]);

    const loadFilterSet = useCallback((name: string): FilterState | null => {
        return savedFilters[name] || null;
    }, [savedFilters]);

    const deleteFilterSet = useCallback((name: string) => {
        setSavedFilters(prev => {
            const newFilters = {...prev};
            delete newFilters[name];
            return newFilters;
        });
    }, [setSavedFilters]);

    return {
        filters: getFiltersFromURL(),
        updateURL,
        savedFilters,
        saveFilterSet,
        loadFilterSet,
        deleteFilterSet,
    };
}