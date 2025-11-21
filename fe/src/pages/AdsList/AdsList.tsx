import {Box, Container, Flex, Heading, Stack} from '@chakra-ui/react';
import {observer} from 'mobx-react-lite';
import {useEffect, useRef, useState} from 'react';

import {LoadingState} from '../../shared/components/LoadingState';
import {adsStore} from '../../store/ads';

import {AdsGrid} from './components/AdsGrid';
import {AdsListHeader} from './components/AdsListHeader';
import {AdsPagination} from './components/AdsPagination';
import {EmptyState} from './components/EmptyState';
import {ErrorBanner} from './components/ErrorBanner';
import {Filters} from './components/Filters/Filters';

export const AdsList = observer(() => {
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);

    useEffect(() => {
        const fetchAdsWithProgress = async () => {
            setLoadingProgress(30);
            await adsStore.fetchAds(1);
            setLoadingProgress(100);
            setTimeout(() => setLoadingProgress(0), 500);
        };

        fetchAdsWithProgress();
    }, []);

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (isSearchFocused || event.key !== '/') return;
            if (
                document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
            )
                return;

            event.preventDefault();

            if (searchInputRef.current) {
                window.scrollTo({top: 0, behavior: 'smooth'});
                setTimeout(() => {
                    searchInputRef.current?.focus();
                    searchInputRef.current?.select();
                }, 300);
            }
        };

        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
    }, [isSearchFocused]);

    const handlePageChange = async (page: number) => {
        setLoadingProgress(30);
        await adsStore.fetchAds(page);
        setLoadingProgress(100);
        setTimeout(() => setLoadingProgress(0), 500);
    };

    const handleSortChange = async (value: string) => {
        const [sortBy, sortOrder] = value.split('_');
        adsStore.setFilters({
            sortBy: sortBy as 'createdAt' | 'price' | 'priority',
            sortOrder: sortOrder as 'asc' | 'desc',
        });
        setLoadingProgress(30);
        await adsStore.fetchAds(1);
        setLoadingProgress(100);
    };

    const handleSearchFocus = () => setIsSearchFocused(true);
    const handleSearchBlur = () => setIsSearchFocused(false);

    const sortValue = `${adsStore.filters.sortBy}_${adsStore.filters.sortOrder}`;

    return (
        <Box
            padding={6}
            background='gray.50'
            minH='100vh'
            maxWidth='1200px'
            mx='auto'
        >
            <Container maxW='container.xl'>
                <Stack gap={6}>
                    <Flex justify='space-between' align='center'>
                        <Heading size='xl'>Модерация объявлений</Heading>
                    </Flex>

                    <Filters
                        onFiltersChange={async () => {
                            setLoadingProgress(30);
                            await adsStore.fetchAds(1);
                            setLoadingProgress(100);
                            setTimeout(() => setLoadingProgress(0), 500);
                        }}
                        searchInputRef={searchInputRef}
                        onSearchFocus={handleSearchFocus}
                        onSearchBlur={handleSearchBlur}
                    />

                    <AdsListHeader
                        totalItems={adsStore.pagination.totalItems}
                        sortValue={sortValue}
                        onSortChange={handleSortChange}
                    />

                    {adsStore.loading ? (
                        <LoadingState 
                            progress={loadingProgress}
                            title="Загрузка объявлений"
                            description="Получаем данные с сервера..."
                            showPercentage={true}
                            size="md"
                        />
                    ) : adsStore.ads.length === 0 ? (
                        <EmptyState error={adsStore.error} />
                    ) : (
                        <>
                            <AdsGrid ads={adsStore.ads} />
                            <AdsPagination
                                totalItems={adsStore.pagination.totalItems}
                                pageSize={adsStore.pagination.limit || 10}
                                currentPage={adsStore.pagination.currentPage}
                                totalPages={adsStore.pagination.totalPages}
                                onPageChange={handlePageChange}
                            />
                        </>
                    )}

                    <ErrorBanner
                        error={adsStore.error}
                        show={!!adsStore.error && adsStore.ads.length > 0}
                    />
                </Stack>
            </Container>
        </Box>
    );
});