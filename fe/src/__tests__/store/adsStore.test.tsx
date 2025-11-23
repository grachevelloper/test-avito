import {query} from '@/shared/config/api';
import {adsStore} from '@/store/ads';
import {Ad, AdsFilter, ModerationAction} from '@/store/ads/types';

// Mock API
jest.mock('@/shared/config/api');

const mockApi = query as jest.Mocked<typeof query>;

const createMockAd = (overrides?: Partial<Ad>): Ad => ({
    id: '1',
    title: 'Test Ad',
    description: 'Test Description',
    price: 1000,
    category: 'Electronics',
    categoryId: 1,
    images: [],
    status: 'pending',
    priority: 'normal',
    createdAt: '2023-01-01T00:00:00.000Z',
    seller: {
        id: '1',
        name: 'Test Seller',
        rating: 4.5,
        totalAds: 10,
        registeredAt: '2022-01-01T00:00:00.000Z',
    },
    moderationHistory: [],
    characteristics: {},
    ...overrides,
});

const createMockModerationAction = (
    overrides?: Partial<ModerationAction>,
): ModerationAction => ({
    id: '1',
    moderatorName: 'Test Moderator',
    action: 'approved',
    timestamp: '2023-01-01T00:00:00.000Z',
    comment: 'Test comment',
    ...overrides,
});

describe('AdsStore', () => {
    let originalConsoleError: typeof console.error;
    let consoleErrorMock: jest.Mock;

    beforeAll(() => {
        originalConsoleError = console.error;
        consoleErrorMock = jest.fn();
        console.error = consoleErrorMock;
    });

    afterAll(() => {
        console.error = originalConsoleError;
    });

    beforeEach(() => {
        // Сбрасываем состояние стора
        adsStore.ads = [];
        adsStore.currentAd = null;
        adsStore.loading = false;
        adsStore.error = null;
        adsStore.filters = {
            status: [],
            search: '',
            sortBy: 'createdAt',
            sortOrder: 'desc',
        };
        adsStore.pagination = {
            currentPage: 1,
            totalPages: 0,
            totalItems: 0,
            limit: 10,
        };

        jest.clearAllMocks();
        consoleErrorMock.mockClear();

        // Мокаем успешные ответы по умолчанию
        mockApi.get.mockResolvedValue({
            data: {
                ads: [],
                pagination: {totalPages: 0, totalItems: 0},
            },
        });
        mockApi.post.mockResolvedValue({data: {}});
    });

    describe('fetchAds', () => {
        it('должен успешно загружать объявления', async () => {
            const mockAds = [createMockAd()];
            const mockResponse = {
                data: {
                    ads: mockAds,
                    pagination: {totalPages: 1, totalItems: 1},
                },
            };

            mockApi.get.mockResolvedValue(mockResponse);

            await adsStore.fetchAds(1);

            expect(adsStore.ads).toEqual(mockAds);
            expect(adsStore.pagination.totalPages).toBe(1);
            expect(adsStore.pagination.totalItems).toBe(1);
            expect(adsStore.pagination.currentPage).toBe(1);
            expect(adsStore.loading).toBe(false);
            expect(adsStore.error).toBeNull();
        });

        it('должен обрабатывать ошибку при загрузке', async () => {
            const error = new Error('Network error');
            mockApi.get.mockRejectedValue(error);

            await adsStore.fetchAds(1);

            expect(adsStore.error).toBe('Ошибка при загрузке объявлений');
            expect(adsStore.loading).toBe(false);
            expect(consoleErrorMock).toHaveBeenCalledWith(
                'Error fetching ads:',
                error,
            );
        });

        it('должен применять фильтры при загрузке', async () => {
            adsStore.setFilters({ 
                search: 'test', 
                status: ['pending'],
                categoryId: '1',
                minPrice: 100,
                maxPrice: 1000,
            });

            const mockResponse = {
                data: { 
                    ads: [createMockAd()], 
                    pagination: {totalPages: 1, totalItems: 1}, 
                },
            };
            mockApi.get.mockResolvedValue(mockResponse);

            await adsStore.fetchAds(1);

            expect(mockApi.get).toHaveBeenCalledWith('/ads', {
                params: expect.any(URLSearchParams),
            });

            // Проверяем что параметры передаются корректно
            const params = mockApi.get.mock.calls[0][1]?.params as URLSearchParams;
            expect(params.get('search')).toBe('test');
            expect(params.get('status')).toBe('pending');
            expect(params.get('categoryId')).toBe('1');
            expect(params.get('minPrice')).toBe('100');
            expect(params.get('maxPrice')).toBe('1000');
        });
    });

    describe('fetchAdById', () => {
        it('должен успешно загружать объявление по ID', async () => {
            const mockAd = createMockAd({
                id: '123',
                moderationHistory: [createMockModerationAction()],
            });
            mockApi.get.mockResolvedValue({data: mockAd});

            await adsStore.fetchAdById('123');

            expect(adsStore.currentAd).toEqual(mockAd);
            expect(adsStore.loading).toBe(false);
            expect(adsStore.error).toBeNull();
        });

        it('должен обрабатывать ошибку при загрузке объявления по ID', async () => {
            const error = new Error('Not found');
            mockApi.get.mockRejectedValue(error);

            await adsStore.fetchAdById('999');

            expect(adsStore.error).toBe('Ошибка при загрузке объявления');
            expect(adsStore.loading).toBe(false);
        });
    });

    describe('действия модерации', () => {
        beforeEach(() => {
            adsStore.currentAd = createMockAd({id: '1'});
            adsStore.ads = [createMockAd({id: '1'})];
        });

        it('должен одобрять объявление', async () => {
            const updatedAd = createMockAd({
                id: '1',
                status: 'approved',
                moderationHistory: [createMockModerationAction({action: 'approved'})],
            });
            mockApi.post.mockResolvedValue({data: {ad: updatedAd}});

            await adsStore.approveAd('1');

            expect(adsStore.currentAd).toEqual(updatedAd);
            expect(mockApi.post).toHaveBeenCalledWith('/ads/1/approve');
            expect(adsStore.loading).toBe(false);
        });

        it('должен отклонять объявление', async () => {
            const updatedAd = createMockAd({
                id: '1',
                status: 'rejected',
                moderationHistory: [createMockModerationAction({action: 'rejected'})],
            });
            mockApi.post.mockResolvedValue({data: {ad: updatedAd}});

            await adsStore.rejectAd('1', 'spam', 'comment');

            expect(adsStore.currentAd).toEqual(updatedAd);
            expect(mockApi.post).toHaveBeenCalledWith('/ads/1/reject', {
                reason: 'spam',
                comment: 'comment',
            });
        });



        it('должен обрабатывать ошибки модерации', async () => {
            const error = new Error('Network error');
            mockApi.post.mockRejectedValue(error);

            await expect(adsStore.approveAd('1')).rejects.toThrow();
            
            expect(adsStore.error).toContain('Ошибка при одобрении объявления');
            expect(consoleErrorMock).toHaveBeenCalledWith(
                'Error approving ad:',
                error,
            );
        });
    });

    describe('навигация по объявлениям', () => {
        beforeEach(() => {
            adsStore.ads = [
                createMockAd({id: '1', title: 'Ad 1'}),
                createMockAd({id: '2', title: 'Ad 2'}),
                createMockAd({id: '3', title: 'Ad 3'}),
            ];
        });

        it('должен получать ID следующего объявления', () => {
            adsStore.currentAd = createMockAd({id: '1'});
            expect(adsStore.getNextAdId()).toBe('2');
        });

        it('должен получать ID предыдущего объявления', () => {
            adsStore.currentAd = createMockAd({id: '2'});
            expect(adsStore.getPreviousAdId()).toBe('1');
        });

        it('должен возвращать null когда нет следующего объявления на текущей странице', () => {
            adsStore.currentAd = createMockAd({id: '3'});
            expect(adsStore.getNextAdId()).toBeNull();
        });

        it('должен возвращать null когда нет предыдущего объявления на текущей странице', () => {
            adsStore.currentAd = createMockAd({id: '1'});
            expect(adsStore.getPreviousAdId()).toBeNull();
        });
    });

    describe('фильтры', () => {
        it('должен устанавливать фильтры корректно', () => {
            const newFilters: Partial<AdsFilter> = {
                search: 'test',
                status: ['pending', 'approved'],
                categoryId: '2',
                minPrice: 100,
                maxPrice: 1000,
            };
            
            adsStore.setFilters(newFilters);

            expect(adsStore.filters.search).toBe('test');
            expect(adsStore.filters.status).toEqual(['pending', 'approved']);
            expect(adsStore.filters.categoryId).toBe('2');
            expect(adsStore.filters.minPrice).toBe(100);
            expect(adsStore.filters.maxPrice).toBe(1000);
        });

        it('должен сбрасывать фильтры кроме сортировки', () => {
            adsStore.setFilters({
                search: 'test',
                status: ['pending'],
                categoryId: '1',
                minPrice: 100,
                maxPrice: 1000,
                sortBy: 'price',
                sortOrder: 'asc',
            });

            adsStore.resetFilters();
            
            expect(adsStore.filters.search).toBe('');
            expect(adsStore.filters.status).toEqual([]);
            expect(adsStore.filters.categoryId).toBeUndefined();
            expect(adsStore.filters.minPrice).toBeUndefined();
            expect(adsStore.filters.maxPrice).toBeUndefined();
            expect(adsStore.filters.sortBy).toBe('price');
            expect(adsStore.filters.sortOrder).toBe('asc');
        });
    });

    describe('пагинация', () => {
        beforeEach(() => {
            adsStore.pagination = {
                currentPage: 1,
                totalPages: 3,
                totalItems: 30,
                limit: 10,
            };
        });

        it('должен загружать следующую страницу', async () => {
            const mockAds = [createMockAd({id: '11'})];
            mockApi.get.mockResolvedValue({
                data: {
                    ads: mockAds,
                    pagination: {totalPages: 3, totalItems: 30},
                },
            });

            const result = await adsStore.loadNextPage();

            expect(result).toBe(true);
            expect(mockApi.get).toHaveBeenCalled();
            // Проверяем что запрос был с правильным номером страницы
            const params = mockApi.get.mock.calls[0][1]?.params as URLSearchParams;
            expect(params.get('page')).toBe('2');
        });

        it('должен возвращать false когда нет следующей страницы', async () => {
            adsStore.pagination.currentPage = 3;
            adsStore.pagination.totalPages = 3;

            const result = await adsStore.loadNextPage();

            expect(result).toBe(false);
            expect(mockApi.get).not.toHaveBeenCalled();
        });

        it('должен загружать предыдущую страницу', async () => {
            adsStore.pagination.currentPage = 2;

            const mockAds = [createMockAd({id: '1'})];
            mockApi.get.mockResolvedValue({
                data: {
                    ads: mockAds,
                    pagination: {totalPages: 3, totalItems: 30},
                },
            });

            const result = await adsStore.loadPreviousPage();

            expect(result).toBe(true);
            const params = mockApi.get.mock.calls[0][1]?.params as URLSearchParams;
            expect(params.get('page')).toBe('1');
        });

        it('должен возвращать false когда нет предыдущей страницы', async () => {
            adsStore.pagination.currentPage = 1;

            const result = await adsStore.loadPreviousPage();

            expect(result).toBe(false);
            expect(mockApi.get).not.toHaveBeenCalled();
        });
    });

    describe('navigateToAd', () => {
        it('должен переходить к существующему объявлению в списке', async () => {
            const existingAd = createMockAd({id: '1'});
            adsStore.ads = [existingAd, createMockAd({id: '2'})];

            const result = await adsStore.navigateToAd('1');

            expect(result).toBe(true);
            expect(adsStore.currentAd).toEqual(existingAd);
            expect(mockApi.get).not.toHaveBeenCalled(); // Не должен делать запрос
        });

        it('должен загружать объявление если его нет в текущем списке', async () => {
            const mockAd = createMockAd({id: '99'});
            mockApi.get.mockResolvedValue({data: mockAd});

            const result = await adsStore.navigateToAd('99');

            expect(result).toBe(true);
            expect(mockApi.get).toHaveBeenCalledWith('/ads/99');
            expect(adsStore.currentAd).toEqual(mockAd);
        });

        it('должен возвращать false при ошибке загрузки', async () => {
            mockApi.get.mockRejectedValue(new Error('Not found'));

            const result = await adsStore.navigateToAd('999');

            expect(result).toBe(false);
            expect(consoleErrorMock).toHaveBeenCalledWith(
                'Error navigating to ad:',
                expect.any(Error),
            );
        });
    });

    describe('updateCurrentAd', () => {
        it('должен обновлять текущее объявление и объявление в списке при совпадении ID', () => {
            const originalAd = createMockAd({id: '1', title: 'Original'});
            const updatedAd = createMockAd({id: '1', title: 'Updated'});

            adsStore.currentAd = originalAd;
            adsStore.ads = [originalAd, createMockAd({id: '2'})];

            adsStore.updateCurrentAd(updatedAd);

            expect(adsStore.currentAd).toEqual(updatedAd);
            expect(adsStore.ads[0]).toEqual(updatedAd);
            expect(adsStore.ads[1]).not.toEqual(updatedAd); // Другие объявления не должны измениться
        });

        it('не должен обновлять если ID не совпадает', () => {
            const originalAd = createMockAd({id: '1', title: 'Original'});
            const updatedAd = createMockAd({id: '2', title: 'Updated'});

            adsStore.currentAd = originalAd;
            adsStore.ads = [originalAd];

            adsStore.updateCurrentAd(updatedAd);

            expect(adsStore.currentAd).toEqual(originalAd); // Не изменилось
            expect(adsStore.ads[0]).toEqual(originalAd); // Не изменилось
        });
    });


});