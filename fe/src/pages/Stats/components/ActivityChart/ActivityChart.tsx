import {Card, Text, Stack, Box, HStack} from '@chakra-ui/react';
import {observer} from 'mobx-react-lite';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';

import {useThemeContext} from '@/shared/components/Navigation/context';

const ACTIVITY_COLORS = {
    approved: '#43A047', // зеленый для одобренных
    rejected: '#E53935', // красный для отклоненных
    requestChanges: '#FFB300', // оранжевый для доработки
};

interface ActivityChartProps {
    data: any;
}

export const ActivityChart = observer(({data}: ActivityChartProps) => {
    const {resolvedTheme} = useThemeContext();

    const isDark = resolvedTheme === 'dark';
    if (!data) return null;

    const chartData = data.labels.map((label: string, index: number) => ({
        name: label,
        approved: data.datasets[0].data[index],
        rejected: data.datasets[1]?.data[index] || 0,
        requestChanges: data.datasets[2]?.data[index] || 0,
    }));

    const chartColors = {
        grid: isDark ? 'var(--chakra-colors-avito-gray-600)' : 'var(--chakra-colors-avito-gray-300)',
        axisText: isDark ? 'var(--chakra-colors-text-secondary)' : 'var(--chakra-colors-text-secondary)',
        tooltipBg: isDark ? 'var(--chakra-colors-background-primary)' : 'var(--chakra-colors-white)',
        tooltipBorder: isDark ? 'var(--chakra-colors-border-default)' : 'var(--chakra-colors-border-default)',
        tooltipText: isDark ? 'var(--chakra-colors-text-primary)' : 'var(--chakra-colors-text-primary)',
        legendText: isDark ? 'var(--chakra-colors-text-primary)' : 'var(--chakra-colors-text-primary)',
    };

    return (
        <Card.Root 
            p={4} 
            variant='outline'
            bg='background.primary'
            borderColor='border.default'
        >
            <Stack gap={4}>
                <HStack justify='space-between' align='center'>
                    <Text 
                        fontSize='lg' 
                        color='text.primary' 
                        fontWeight='semibold'
                    >
                        Активность проверок
                    </Text>
                </HStack>
                <Box height='300px'>
                    <ResponsiveContainer width='100%' height='100%'>
                        <BarChart 
                            data={chartData}
                            margin={{top: 20, right: 30, left: 20, bottom: 5}}
                        >
                            <CartesianGrid 
                                strokeDasharray='3 3' 
                                vertical={false}
                                stroke={chartColors.grid}
                            />
                            <XAxis 
                                dataKey='name' 
                                axisLine={false}
                                tickLine={false}
                                tick={{fill: chartColors.axisText, fontSize: 12}}
                            />
                            <YAxis 
                                axisLine={false}
                                tickLine={false}
                                tick={{fill: chartColors.axisText, fontSize: 12}}
                            />
                            <Tooltip 
                                contentStyle={{
                                    backgroundColor: chartColors.tooltipBg,
                                    border: `1px solid ${chartColors.tooltipBorder}`,
                                    borderRadius: '8px',
                                    color: chartColors.tooltipText,
                                }}
                            />
                            <Legend 
                                verticalAlign='top'
                                height={36}
                                formatter={(value) => (
                                    <span style={{
                                        color: chartColors.legendText, 
                                        fontSize: '12px',
                                    }}>
                                        {value}
                                    </span>
                                )}
                            />
                            <Bar
                                dataKey='approved'
                                fill={ACTIVITY_COLORS.approved}
                                name='Одобрено'
                                radius={[2, 2, 0, 0]}
                            />
                            <Bar
                                dataKey='rejected'
                                fill={ACTIVITY_COLORS.rejected}
                                name='Отклонено'
                                radius={[2, 2, 0, 0]}
                            />
                            <Bar
                                dataKey='requestChanges'
                                fill={ACTIVITY_COLORS.requestChanges}
                                name='На доработку'
                                radius={[2, 2, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
            </Stack>
        </Card.Root>
    );
});