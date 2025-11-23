import {Card, Text, Stack, Box, HStack} from '@chakra-ui/react';
import {observer} from 'mobx-react-lite';
import {PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip} from 'recharts';

import {useThemeContext} from '@/shared/components/Navigation/context';

// Цвета на основе вашей темы Авито
const AVITO_COLORS = [
    'var(--chakra-colors-avito-blue-500)',
    'var(--chakra-colors-avito-orange-500)',
    'var(--chakra-colors-status-success)',
    'var(--chakra-colors-status-warning)',
    'var(--chakra-colors-avito-gray-500)',
    'var(--chakra-colors-status-error)',
];

interface DecisionsChartProps {
    data: any;
}

export const DecisionsChart = observer(({data}: DecisionsChartProps) => {
    const {resolvedTheme} = useThemeContext();

    const isDark = resolvedTheme === 'dark';
    if (!data) return null;

    const pieData = data.labels.map((label: string, index: number) => ({
        name: label,
        value: data.datasets[0].data[index] || 0,
    }));

    const chartColors = {
        tooltipBg: isDark ? 'var(--chakra-colors-background-primary)' : 'var(--chakra-colors-white)',
        tooltipBorder: isDark ? 'var(--chakra-colors-border-default)' : 'var(--chakra-colors-border-default)',
        tooltipText: isDark ? 'var(--chakra-colors-text-primary)' : 'var(--chakra-colors-text-primary)',
        legendText: isDark ? 'var(--chakra-colors-text-primary)' : 'var(--chakra-colors-text-primary)',
        stroke: isDark ? 'var(--chakra-colors-background-primary)' : 'var(--chakra-colors-white)',
    };

    const renderCustomizedLabel = ({
        cx, cy, midAngle, innerRadius, outerRadius, percent,
    }: any) => {
        if (!percent) return null;
        
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text 
                x={x} 
                y={y} 
                fill={isDark ? 'var(--chakra-colors-text-inverse)' : 'var(--chakra-colors-text-inverse)'}
                textAnchor={x > cx ? 'start' : 'end'} 
                dominantBaseline='central'
                fontSize={12}
                fontWeight='bold'
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
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
                        fontWeight='semibold' 
                        color='text.primary'
                    >
                        Распределение решений
                    </Text>
                </HStack>
                <Box height='300px'>
                    <ResponsiveContainer width='100%' height='100%'>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx='50%'
                                cy='50%'
                                labelLine={false}
                                label={renderCustomizedLabel}
                                outerRadius={100}
                                innerRadius={40}
                                fill='#8884d8'
                                dataKey='value'
                                paddingAngle={2}
                            >
                                {pieData.map((_: any, index: number) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={AVITO_COLORS[index % AVITO_COLORS.length]}
                                        stroke={chartColors.stroke}
                                        strokeWidth={2}
                                    />
                                ))}
                            </Pie>
                            <Tooltip 
                                formatter={(value: number) => [`${value} решений`, 'Количество']}
                                contentStyle={{
                                    backgroundColor: chartColors.tooltipBg,
                                    border: `1px solid ${chartColors.tooltipBorder}`,
                                    borderRadius: '8px',
                                    color: chartColors.tooltipText,
                                }}
                            />
                            <Legend 
                                verticalAlign='bottom' 
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
                        </PieChart>
                    </ResponsiveContainer>
                </Box>
            </Stack>
        </Card.Root>
    );
});