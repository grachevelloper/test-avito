import {Card, Text, Grid, Button, HStack, Badge} from '@chakra-ui/react';
import {useState} from 'react';

import {statsStore} from '../../../../store/stats';

const periodOptions = [
    {label: 'Сегодня', value: 'today'},
    {label: '7 дней', value: 'week'},
    {label: '30 дней', value: 'month'},
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

    const getPeriodLabel = () => {
        return periodOptions.find(opt => opt.value === selectedPeriod)?.label || 'Период';
    };

    return (
        <Card.Root 
            p={5} 
            bg='background.secondary'
            border='1px'
            borderColor='border.default'
            borderRadius='xl'
        >
            <Grid gap={5}>
                <HStack justify='space-between' align='center'>
                    <HStack gap={3}>
                        <Text fontSize='lg' fontWeight='bold' color='text.primary'>
                            Аналитика за период
                        </Text>
                        <Badge 
                            variant='subtle' 
                            colorScheme='blue'
                            px={3}
                            py={1}
                            borderRadius='full'
                            fontSize='sm'
                        >
                            {getPeriodLabel()}
                        </Badge>
                    </HStack>
                    <HStack gap={2}>
                        <Button
                            size='sm'
                            variant='outline'
                            loading={exportLoading === 'csv'}
                            onClick={() => handleExport('csv')}
                            disabled={!!exportLoading}
                            borderColor='border.strong'
                            color='text.secondary'
                            _hover={{
                                bg: 'background.tertiary',
                                color: 'text.primary',
                            }}
                        >
                            CSV
                        </Button>
                        <Button
                            size='sm'
                            variant='solid'
                            loading={exportLoading === 'pdf'}
                            onClick={() => handleExport('pdf')}
                            disabled={!!exportLoading}
                            bg='primary.default'
                            color='text.inverse'
                            _hover={{
                                bg: 'primary.hover',
                            }}
                        >
                            PDF
                        </Button>
                    </HStack>
                </HStack>

                <Grid
                    templateColumns={{
                        base: 'repeat(3, 1fr)',
                    }}
                    gap={3}
                >
                    {periodOptions.map((option) => (
                        <Button
                            key={option.value}
                            variant={selectedPeriod === option.value ? 'solid' : 'outline'}
                            onClick={() => onPeriodChange(option.value)}
                            size='md'
                            bg={selectedPeriod === option.value ? 'primary.default' : 'transparent'}
                            color={selectedPeriod === option.value ? 'text.inverse' : 'text.secondary'}
                            borderColor={selectedPeriod === option.value ? 'primary.default' : 'border.default'}
                            _hover={{
                                bg: selectedPeriod === option.value ? 'primary.hover' : 'background.tertiary',
                                color: selectedPeriod === option.value ? 'text.inverse' : 'text.primary',
                            }}
                            fontWeight='medium'
                            borderRadius='lg'
                        >
                            {option.label}
                        </Button>
                    ))}
                </Grid>
            </Grid>
        </Card.Root>
    );
};