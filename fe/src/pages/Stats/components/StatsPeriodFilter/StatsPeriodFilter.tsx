import {Card, Text, Grid, Button, HStack} from '@chakra-ui/react';
import {useState} from 'react';

import {statsStore} from '../../../../store/stats';

const periodOptions = [
    {label: 'Сегодня', value: 'today'},
    {label: 'Последние 7 дней', value: 'week'},
    {label: 'Последние 30 дней', value: 'month'},
];

interface StatsPeriodFilterProps {
  selectedPeriod: string;
  onPeriodChange: (selectedPeriod: string) => void;
}

export const StatsPeriodFilter = ({
    selectedPeriod,
    onPeriodChange,
}: StatsPeriodFilterProps) => {
    const [exportLoading, setExportLoading] = useState<string | null>(null);

    const chartType = 'categories';
        
    const handleExport = (format: 'csv' | 'pdf') => {
        setExportLoading(format);
        try {
            const blob = statsStore.exportData(format, selectedPeriod);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const timestamp = new Date().toISOString().split('T')[0];
            const periodName = selectedPeriod === 'day' ? 'daily' : 
                selectedPeriod === 'week' ? 'weekly' : 
                    selectedPeriod === 'month' ? 'monthly' : 'yearly';
            const filename = `${chartType}_stats_${periodName}_${timestamp}.${format}`;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Export error:', error);
            alert('Ошибка при экспорте данных');
        } finally {
            setExportLoading(null);
        }
    };
    return (
        <Card.Root p={4}>
            <Grid gap={4}>
                <HStack  justify='space-between' align='center'>
                    <Text fontSize='lg' fontWeight='semibold'>
                        Период
                    </Text>
                    <HStack>
                        <Button
                            size='sm'
                            variant='outline'
                            loading={exportLoading === 'csv'}
                            onClick={() => handleExport('csv')}
                            disabled={!!exportLoading}
                        >
                                      CSV
                        </Button>
                        <Button
                            size='sm'
                            variant='outline'
                            loading={exportLoading === 'pdf'}
                            onClick={() => handleExport('pdf')}
                            disabled={!!exportLoading}
                        >
                                      PDF
                        </Button>
                    </HStack>
                </HStack>

                <Grid
                    templateColumns={{
                        base: '1fr',
                        md: 'repeat(3, 1fr)',
                    }}
                    gap={2}
                >
                    {periodOptions.map((option) => (
                        <Button
                            key={option.value}
                            variant={selectedPeriod === option.value ? 'solid' : 'outline'}
                            onClick={() => onPeriodChange(option.value)}
                            size='md'
                        >
                            {option.label}
                        </Button>
                    ))}
                </Grid>
            </Grid>
        </Card.Root>
    );
};
