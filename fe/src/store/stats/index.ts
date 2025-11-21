import {jsPDF} from 'jspdf';
import {makeAutoObservable, runInAction} from 'mobx';
import Papa from 'papaparse';

import {query} from '@/shared/config/api';

import {ChartData, StatsSummary} from './types';

const COLORS = ['#00C49F', '#FF8042', '#FFBB28'];
const ACTIVITY_COLORS = {
    approved: '#00C49F',
    rejected: '#FF8042',
    requestChanges: '#FFBB28',
};

class StatsStore {
    summary: StatsSummary | null = null;
    activityChart: ChartData | null = null;
    decisionsChart: ChartData | null = null;
    categoriesChart: any = null;
    loading = false;
    error: string | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    async fetchSummary(period: string = 'week') {
        this.loading = true;
        this.error = null;

        try {
            const response = await query.get('/stats/summary', {params: {period}});
            console.log(response);
            runInAction(() => {
                this.summary = response.data;
            });
        } catch (error) {
            runInAction(() => {
                this.error = 'Ошибка при загрузке статистики';
            });
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    async fetchCharts(period: string = 'week') {
        try {
            const [activityResponse, decisionsResponse, categoriesResponse] =
        await Promise.all([
            query.get('/stats/chart/activity', {params: {period}}),
            query.get('/stats/chart/decisions', {params: {period}}),
            query.get('/stats/chart/categories', {params: {period}}),
        ]);

            const activityData = this.transformActivityData(activityResponse.data);
            const decisionsData = this.transformDecisionsData(decisionsResponse.data);

            runInAction(() => {
                this.activityChart = activityData;
                this.decisionsChart = decisionsData;
                this.categoriesChart = categoriesResponse.data;
            });
        } catch (error) {
            runInAction(() => {
                this.error = 'Ошибка при загрузке графиков';
            });
        }
    }

    

    private transformActivityData(queryData: any[]): ChartData {
        const labels = queryData.map((item) => {
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
                    data: queryData.map((item) => item.approved),
                    backgroundColor: [ACTIVITY_COLORS.approved],
                },
                {
                    label: 'Отклонено',
                    data: queryData.map((item) => item.rejected),
                    backgroundColor: [ACTIVITY_COLORS.rejected],
                },
                {
                    label: 'На доработку',
                    data: queryData.map((item) => item.requestChanges),
                    backgroundColor: [ACTIVITY_COLORS.requestChanges],
                },
            ],
        };
    }

    private transformDecisionsData(queryData: any): ChartData {
        return {
            labels: ['Одобрено', 'Отклонено', 'На доработку'],
            datasets: [
                {
                    label: 'Решения',
                    data: [
                        queryData.approved || 0,
                        queryData.rejected || 0,
                        queryData.requestChanges || 0,
                    ],
                    backgroundColor: COLORS,
                },
            ],
        };
    }

    exportData(format: 'csv' | 'pdf', period: string) {
        try {
            if (format === 'csv') {
                return this.generateCSV(period);
            } else if (format === 'pdf') {
                return this.generatePDF(period);
            }
            throw new Error('Unsupported format');
        } catch (error) {
            console.error('Export error:', error);
            throw new Error('Ошибка при экспорте данных');
        }
    }

    private generateCSV(period: string): Blob {
        try {
            const sections = this.prepareCSVSections(period);
            let csvContent = '\uFEFF'; 
        
            sections.forEach((section) => {
                if (section.data.length > 0) {
                    csvContent += `# ${section.title}\n`;
                    const sectionCSV = Papa.unparse(section.data, {
                        quotes: true,
                        header: section.hasHeader,
                        skipEmptyLines: true,
                        delimiter: ';',
                    });
                
                    csvContent += sectionCSV + '\n\n';
                }
            });

            return new Blob([csvContent], {type: 'text/csv;charset=utf-8;'});
        } catch (error) {
            console.error('CSV generation error:', error);
            throw new Error('Ошибка при генерации CSV файла');
        }
    }

    private prepareCSVSections(period: string): Array<{title: string; data: any[]; hasHeader: boolean}> {
        const sections: Array<{title: string; data: any[]; hasHeader: boolean}> = [];

        sections.push({
            title: `Статистика модерации - ${this.getPeriodName(period)}`,
            data: [['Период', this.getPeriodName(period)], ['Дата генерации', new Date().toLocaleString('ru-RU')]],
            hasHeader: false,
        });

        if (this.summary) {
            const summaryData = [
                ['Показатель', 'Значение'],
                ['Всего проверено', this.summary.totalReviewed ?? 0],
                ['Проверено сегодня', this.summary.totalReviewedToday ?? 0],
                ['Проверено за неделю', this.summary.totalReviewedThisWeek ?? 0],
                ['Проверено за месяц', this.summary.totalReviewedThisMonth ?? 0],
                ['Одобрено', this.summary.approvedCount ?? 0],
                ['Отклонено', this.summary.rejectedCount ?? 0],
                ['Процент одобренных', `${this.summary.approvedPercentage ?? 0}%`],
                ['Процент отклоненных', `${this.summary.rejectedPercentage ?? 0}%`],
                ['Процент на доработку', `${this.summary.requestChangesPercentage ?? 0}%`],
                ['Среднее время проверки', `${this.summary.averageReviewTime ?? 0} мин`],
            ];
        
            sections.push({
                title: 'Сводка статистики',
                data: summaryData,
                hasHeader: true,
            });
        }

        // Активность
        if (this.activityChart && this.activityChart.labels.length > 0) {
            const activityHeaders = ['Дата', 'Одобрено', 'Отклонено', 'На доработку'];
            const activityData = [
                activityHeaders,
                ...this.activityChart.labels.map((label: string, index: number) => [
                    label,
                this.activityChart!.datasets[0].data[index] ?? 0,
                this.activityChart!.datasets[1]?.data[index] ?? 0,
                this.activityChart!.datasets[2]?.data[index] ?? 0,
                ]),
            ];
        
            sections.push({
                title: 'Активность модерации по дням',
                data: activityData,
                hasHeader: true,
            });
        }

        // Решения
        if (this.decisionsChart) {
            const decisionsData = [
                ['Тип решения', 'Количество'],
                ...this.decisionsChart.labels.map((label: string, index: number) => [
                    label,
                this.decisionsChart!.datasets[0].data[index] ?? 0,
                ]),
            ];
        
            sections.push({
                title: 'Распределение решений',
                data: decisionsData,
                hasHeader: true,
            });
        }

        // Категории
        if (this.categoriesChart) {
            const categoriesData = [
                ['Категория', 'Количество объявлений'],
                ...Object.entries(this.categoriesChart)
                    .sort(([,a]: any, [,b]: any) => (b ?? 0) - (a ?? 0))
                    .slice(0, 10)
                    .map(([category, count]) => [category, count ?? 0]),
            ];
        
            sections.push({
                title: 'Топ категорий',
                data: categoriesData,
                hasHeader: true,
            });
        }

        return sections;
    }

    private generatePDF(period: string): Blob {
        try {
            const doc = new jsPDF();
        
            const pageWidth = doc.internal.pageSize.width;
            const margin = 20;
            let yPosition = margin;
        
            doc.setFontSize(18);
            doc.addFont('/fonts/DejaVuSans.ttf', 'DejaVuSans', 'normal');
            doc.setFont('DejaVuSans');

            doc.text('СТАТИСТИКА МОДЕРАЦИИ', pageWidth / 2, yPosition, {align: 'center'});
            yPosition += 15;
        
            doc.setFontSize(12);
            doc.text(`Период: ${this.getPeriodName(period)}`, margin, yPosition);
            yPosition += 8;
            doc.text(`Дата генерации: ${new Date().toLocaleString('ru-RU')}`, margin, yPosition);
            yPosition += 15;
        
            const addSection = (title: string, data: string[][]) => {
                if (yPosition > doc.internal.pageSize.height - 50) {
                    doc.addPage();
                    yPosition = margin;
                }
            
                doc.setFontSize(14);
                doc.text(title, margin, yPosition);
                yPosition += 10;
            
                doc.setFontSize(10);
                data.forEach(([key, value]) => {
                    if (yPosition > doc.internal.pageSize.height - 20) {
                        doc.addPage();
                        yPosition = margin;
                    }
                    doc.text(`${key}:`, margin, yPosition);
                    doc.text(value, pageWidth - margin, yPosition, {align: 'right'});
                    yPosition += 7;
                });
            
                yPosition += 10;
            };
        
            if (this.summary) {
                const summaryData = [
                    ['Всего проверено', (this.summary.totalReviewed ?? 0).toString()],
                    ['Проверено сегодня', (this.summary.totalReviewedToday ?? 0).toString()],
                    ['Проверено за неделю', (this.summary.totalReviewedThisWeek ?? 0).toString()],
                    ['Проверено за месяц', (this.summary.totalReviewedThisMonth ?? 0).toString()],
                    ['Одобрено', (this.summary.approvedCount ?? 0).toString()],
                    ['Отклонено', (this.summary.rejectedCount ?? 0).toString()],
                    ['Процент одобренных', `${this.summary.approvedPercentage ?? 0}%`],
                    ['Процент отклоненных', `${this.summary.rejectedPercentage ?? 0}%`],
                    ['Процент на доработку', `${this.summary.requestChangesPercentage ?? 0}%`],
                    ['Среднее время проверки', `${this.summary.averageReviewTime ?? 0} минут`],
                ];
                addSection('ИТОГИ', summaryData);
            }
        
            if (this.activityChart && this.activityChart.labels.length > 0) {
                const activityData = this.activityChart.labels.map((label: string, index: number) => [
                    label,
                    `A:${this.activityChart!.datasets[0].data[index] ?? 0} R:${this.activityChart!.datasets[1]?.data[index] ?? 0} C:${this.activityChart!.datasets[2]?.data[index] ?? 0}`,
                ]);
                addSection('АКТИВНОСТЬ МОДЕРАЦИИ', activityData);
            }
        
            if (this.decisionsChart) {
                const decisionsData = this.decisionsChart.labels.map((label: string, index: number) => [
                    label,
                    (this.decisionsChart!.datasets[0].data[index] ?? 0).toString(),
                ]);
                addSection('РЕШЕНИЯ ПОТРЕБИТЕЛЕЙ', decisionsData);
            }
        
            if (this.categoriesChart) {
                const categoriesData = Object.entries(this.categoriesChart)
                    .sort(([,a]: any, [,b]: any) => (b ?? 0) - (a ?? 0))
                    .slice(0, 10)
                    .map(([category, count]) => [category, (count ?? 0).toString()]);
                addSection('ТОП КАТЕГОРИЙ', categoriesData);
            }
        
            return doc.output('blob');
        } catch (error) {
            console.error('PDF generation error:', error);
            throw new Error('PDF generation error');
        }
    }

    private getPeriodName(period: string): string {
        const periods: { [key: string]: string } = {
            'day': 'За день',
            'week': 'За неделю', 
            'month': 'За месяц',
            'year': 'За год',
        };
        return periods[period] || period;
    }
}



export const statsStore = new StatsStore();
