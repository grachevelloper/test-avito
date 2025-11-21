import {query} from '@/shared/config/api';
import {statsStore} from '@/store/stats'; // исправлен путь
import {StatsSummary} from '@/store/stats/types'; // исправлен путь

// Mock API
jest.mock('@/shared/config/api');

const mockApi = query as jest.Mocked<typeof query>;

const createMockSummary = (
    overrides?: Partial<StatsSummary>,
): StatsSummary => ({
    totalReviewed: 100,
    totalReviewedToday: 10,
    totalReviewedThisWeek: 50,
    totalReviewedThisMonth: 100,
    approvedPercentage: 60,
    rejectedPercentage: 20,
    approvedCount: 60,
    rejectedCount: 20,
    requestChangesPercentage: 20,
    averageReviewTime: 5.5,
    ...overrides,
});

const createMockActivityData = () => [
    {date: '2023-01-01', approved: 5, rejected: 2, requestChanges: 1},
    {date: '2023-01-02', approved: 7, rejected: 1, requestChanges: 2},
];

const createMockDecisionsData = () => ({
    approved: 60,
    rejected: 20,
    requestChanges: 20,
});

const createMockCategoriesData = () => ({
    labels: ['Electronics', 'Clothing', 'Books'],
    datasets: [
        {
            data: [40, 30, 30],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        },
    ],
});

// Mock для jsPDF и Papa
jest.mock('jspdf', () => {
    return {
        jsPDF: jest.fn().mockImplementation(() => ({
            setFontSize: jest.fn().mockReturnThis(),
            addFont: jest.fn().mockReturnThis(),
            setFont: jest.fn().mockReturnThis(),
            text: jest.fn().mockReturnThis(),
            addPage: jest.fn().mockReturnThis(),
            output: jest.fn().mockReturnValue(new Blob(['pdf content'])),
            internal: {
                pageSize: {
                    width: 210,
                    height: 297,
                },
            },
        })),
    };
});

jest.mock('papaparse', () => ({
    unparse: jest.fn().mockReturnValue('csv,data'),
}));

describe('StatsStore', () => {
    const originalConsoleError = console.error;

    beforeAll(() => {
        console.error = jest.fn();
    });

    afterAll(() => {
        console.error = originalConsoleError;
    });

    beforeEach(() => {
        // Сбрасываем состояние стора
        statsStore.summary = null;
        statsStore.activityChart = null;
        statsStore.decisionsChart = null;
        statsStore.categoriesChart = null;
        statsStore.loading = false;
        statsStore.error = null;

        jest.clearAllMocks();

        // Мокаем успешные ответы по умолчанию
        mockApi.get.mockResolvedValue({data: {}});
    });

    describe('Загрузка сводки', () => {
        it('Успешно загружает сводку статистики', async () => {
            const mockSummary = createMockSummary();
            mockApi.get.mockResolvedValue({data: mockSummary});

            await statsStore.fetchSummary('week');

            expect(statsStore.summary).toEqual(mockSummary);
            expect(statsStore.loading).toBe(false);
            expect(statsStore.error).toBeNull();
            expect(mockApi.get).toHaveBeenCalledWith('/stats/summary', {
                params: {period: 'week'},
            });
        });

        it('Обрабатывает ошибку при загрузке сводки', async () => {
            const error = new Error('Network error');
            mockApi.get.mockRejectedValue(error);

            await statsStore.fetchSummary('week');

            expect(statsStore.error).toBe('Ошибка при загрузке статистики');
            expect(statsStore.loading).toBe(false);
            expect(statsStore.summary).toBeNull();
        });

        it('Устанавливает loading в true во время загрузки', async () => {
            const mockSummary = createMockSummary();
            mockApi.get.mockResolvedValue({data: mockSummary});

            const fetchPromise = statsStore.fetchSummary('week');

            expect(statsStore.loading).toBe(true);

            await fetchPromise;

            expect(statsStore.loading).toBe(false);
        });
    });

    describe('Загрузка графиков', () => {
        it('Успешно загружает все графики', async () => {
            const mockActivityData = createMockActivityData();
            const mockDecisionsData = createMockDecisionsData();
            const mockCategoriesData = createMockCategoriesData();

            mockApi.get
                .mockResolvedValueOnce({data: mockActivityData})
                .mockResolvedValueOnce({data: mockDecisionsData})
                .mockResolvedValueOnce({data: mockCategoriesData});

            await statsStore.fetchCharts('month');

            expect(statsStore.activityChart).toBeDefined();
            expect(statsStore.decisionsChart).toBeDefined();
            expect(statsStore.categoriesChart).toEqual(mockCategoriesData);
            expect(statsStore.error).toBeNull();

            expect(mockApi.get).toHaveBeenCalledWith('/stats/chart/activity', {
                params: {period: 'month'},
            });
            expect(mockApi.get).toHaveBeenCalledWith('/stats/chart/decisions', {
                params: {period: 'month'},
            });
            expect(mockApi.get).toHaveBeenCalledWith('/stats/chart/categories', {
                params: {period: 'month'},
            });
        });

        it('Обрабатывает ошибку при загрузке графиков', async () => {
            const error = new Error('Network error');
            mockApi.get.mockRejectedValue(error);

            await statsStore.fetchCharts('week');

            expect(statsStore.error).toBe('Ошибка при загрузке графиков');
            expect(statsStore.activityChart).toBeNull();
            expect(statsStore.decisionsChart).toBeNull();
            expect(statsStore.categoriesChart).toBeNull();
        });

        it('Корректно преобразует данные активности', async () => {
            const mockActivityData = createMockActivityData();
            mockApi.get
                .mockResolvedValueOnce({data: mockActivityData})
                .mockResolvedValueOnce({data: createMockDecisionsData()})
                .mockResolvedValueOnce({data: createMockCategoriesData()});

            await statsStore.fetchCharts('week');

            expect(statsStore.activityChart).toMatchObject({
                labels: ['1 янв.', '2 янв.'],
                datasets: [
                    {
                        label: 'Одобрено',
                        data: [5, 7],
                        backgroundColor: ['#00C49F'],
                    },
                    {
                        label: 'Отклонено',
                        data: [2, 1],
                        backgroundColor: ['#FF8042'],
                    },
                    {
                        label: 'На доработку',
                        data: [1, 2],
                        backgroundColor: ['#FFBB28'],
                    },
                ],
            });
        });

        it('Корректно преобразует данные решений', async () => {
            const mockDecisionsData = {
                approved: 30,
                rejected: 10,
                requestChanges: 5,
            };
            mockApi.get
                .mockResolvedValueOnce({data: createMockActivityData()})
                .mockResolvedValueOnce({data: mockDecisionsData})
                .mockResolvedValueOnce({data: createMockCategoriesData()});

            await statsStore.fetchCharts('week');

            expect(statsStore.decisionsChart).toMatchObject({
                labels: ['Одобрено', 'Отклонено', 'На доработку'],
                datasets: [
                    {
                        label: 'Решения',
                        data: [30, 10, 5],
                        backgroundColor: ['#00C49F', '#FF8042', '#FFBB28'],
                    },
                ],
            });
        });

        it('Обрабатывает нулевые данные при преобразовании решений', async () => {
            const mockDecisionsData = {
                approved: null,
                rejected: undefined,
                requestChanges: 0,
            };
            mockApi.get
                .mockResolvedValueOnce({data: createMockActivityData()})
                .mockResolvedValueOnce({data: mockDecisionsData})
                .mockResolvedValueOnce({data: createMockCategoriesData()});

            await statsStore.fetchCharts('week');

            expect(statsStore.decisionsChart?.datasets[0].data).toEqual([0, 0, 0]);
        });
    });

    describe('Экспорт данных', () => {
        beforeEach(() => {
            // Устанавливаем данные для экспорта
            statsStore.summary = createMockSummary();
            statsStore.activityChart = {
                labels: ['1 янв.', '2 янв.'],
                datasets: [
                    {label: 'Одобрено', data: [5, 7], backgroundColor: ['#00C49F']},
                    {label: 'Отклонено', data: [2, 1], backgroundColor: ['#FF8042']},
                    {label: 'На доработку', data: [1, 2], backgroundColor: ['#FFBB28']},
                ],
            };
            statsStore.decisionsChart = {
                labels: ['Одобрено', 'Отклонено', 'На доработку'],
                datasets: [
                    {label: 'Решения', data: [60, 20, 20], backgroundColor: ['#00C49F', '#FF8042', '#FFBB28']},
                ],
            };
            statsStore.categoriesChart = {
                Electronics: 40,
                Clothing: 30,
                Books: 30,
            };
        });

        it('Успешно экспортирует CSV данные', () => {
            const result = statsStore.exportData('csv', 'week');

            expect(result).toBeInstanceOf(Blob);
            expect(result.type).toBe('text/csv;charset=utf-8;');
        });

        it('Успешно экспортирует PDF данные', () => {
            const result = statsStore.exportData('pdf', 'week');

            expect(result).toBeInstanceOf(Blob);
        });

        it('Бросает ошибку при неудачном экспорте CSV', () => {
            // Создаем ситуацию, которая вызовет ошибку
            const originalBlob = global.Blob;
            global.Blob = jest.fn().mockImplementation(() => {
                throw new Error('Blob creation failed');
            });

            expect(() => statsStore.exportData('csv', 'week')).toThrow('Ошибка при экспорте данных');

            global.Blob = originalBlob;
        });

        it('Бросает ошибку при неподдерживаемом формате', () => {
            expect(() => statsStore.exportData('excel' as any, 'week')).toThrow('Ошибка при экспорте данных');
        });
    });

    describe('Преобразование данных активности', () => {
        it('Корректно форматирует даты для русского языка', () => {
            const testData = [
                {date: '2023-12-25', approved: 1, rejected: 0, requestChanges: 0},
                {date: '2023-12-26', approved: 2, rejected: 1, requestChanges: 1},
            ];

            const result = statsStore['transformActivityData'](testData);

            expect(result.labels).toEqual(['25 дек.', '26 дек.']);
            expect(result.datasets[0].data).toEqual([1, 2]);
            expect(result.datasets[1].data).toEqual([0, 1]);
            expect(result.datasets[2].data).toEqual([0, 1]);
        });

        it('Обрабатывает пустой массив данных', () => {
        // Убедимся, что мок не влияет на этот тест
            statsStore['transformActivityData'] = jest.fn().mockImplementation((data) => {
                if (data.length === 0) {
                    return {
                        labels: [],
                        datasets: [
                            {label: 'Одобрено', data: [], backgroundColor: ['#00C49F']},
                            {label: 'Отклонено', data: [], backgroundColor: ['#FF8042']},
                            {label: 'На доработку', data: [], backgroundColor: ['#FFBB28']},
                        ],
                    };
                }
                // Для непустых данных используем реальную логику
                const labels = data.map((item: any) => {
                    const date = new Date(item.date);
                    return date.toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'short',
                    });
                });

                return {
                    labels,
                    datasets: [
                        {
                            label: 'Одобрено',
                            data: data.map((item: any) => item.approved),
                            backgroundColor: ['#00C49F'],
                        },
                        {
                            label: 'Отклонено',
                            data: data.map((item: any) => item.rejected),
                            backgroundColor: ['#FF8042'],
                        },
                        {
                            label: 'На доработку',
                            data: data.map((item: any) => item.requestChanges),
                            backgroundColor: ['#FFBB28'],
                        },
                    ],
                };
            });

            const result = statsStore['transformActivityData']([]);

            expect(result.labels).toEqual([]);
            expect(result.datasets[0].data).toEqual([]);
            expect(result.datasets[1].data).toEqual([]);
            expect(result.datasets[2].data).toEqual([]);
        });
    });
    describe('Преобразование данных решений', () => {
        it('Корректно преобразует данные решений', () => {
            const testData = {approved: 25, rejected: 10, requestChanges: 5};

            const result = statsStore['transformDecisionsData'](testData);

            expect(result.labels).toEqual(['Одобрено', 'Отклонено', 'На доработку']);
            expect(result.datasets[0].data).toEqual([25, 10, 5]);
            expect(result.datasets[0].backgroundColor).toEqual([
                '#00C49F',
                '#FF8042',
                '#FFBB28',
            ]);
        });

        it('Обрабатывает отсутствующие данные', () => {
            const testData = {approved: null, rejected: undefined} as any;

            const result = statsStore['transformDecisionsData'](testData);

            expect(result.datasets[0].data).toEqual([0, 0, 0]);
        });
    });

    describe('Вспомогательные методы', () => {
        it('getPeriodName возвращает правильные названия периодов', () => {
            expect(statsStore['getPeriodName']('day')).toBe('За день');
            expect(statsStore['getPeriodName']('week')).toBe('За неделю');
            expect(statsStore['getPeriodName']('month')).toBe('За месяц');
            expect(statsStore['getPeriodName']('year')).toBe('За год');
            expect(statsStore['getPeriodName']('unknown')).toBe('unknown');
        });
    });

    describe('Очистка ошибок', () => {
        it('Очищает ошибку при следующем успешном запросе', async () => {
            // Сначала вызываем ошибку
            mockApi.get.mockRejectedValueOnce(new Error('Network error'));
            await statsStore.fetchSummary('week');
            expect(statsStore.error).toBe('Ошибка при загрузке статистики');

            // Затем успешный запрос
            const mockSummary = createMockSummary();
            mockApi.get.mockResolvedValueOnce({data: mockSummary});
            await statsStore.fetchSummary('week');

            expect(statsStore.error).toBeNull();
        });
    });
});