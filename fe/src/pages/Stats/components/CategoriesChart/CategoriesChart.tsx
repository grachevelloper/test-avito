import {Card, Text, VStack, Box, HStack} from '@chakra-ui/react';
import {observer} from 'mobx-react-lite';
import {
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    ResponsiveContainer,
    Tooltip,
} from 'recharts';

import {useThemeContext} from '@/shared/components/Navigation/context';

interface CategoriesChartProps {
    data: any;
}

export const CategoriesChart = observer(({data}: CategoriesChartProps) => {
    const {resolvedTheme} = useThemeContext();

    const isDark = resolvedTheme === 'dark';

    if (!data) return null;

    const chartData = Object.entries(data)
        .map(([category, count]) => ({
            subject: category,
            A: count as number,
            fullMark: Math.max(...Object.values(data) as unknown as number[]),
        }))
        .sort((a, b) => b.A - a.A)
        .slice(0, 8);

    const chartColors = {
        grid: isDark ? 'var(--chakra-colors-avito-gray-600)' : 'var(--chakra-colors-avito-gray-300)',
        axisText: isDark ? 'var(--chakra-colors-text-primary)' : 'var(--chakra-colors-text-primary)',
        tooltipBg: isDark ? 'var(--chakra-colors-background-primary)' : 'var(--chakra-colors-white)',
        tooltipBorder: isDark ? 'var(--chakra-colors-border-default)' : 'var(--chakra-colors-border-default)',
        tooltipText: isDark ? 'var(--chakra-colors-text-primary)' : 'var(--chakra-colors-text-primary)',
        radarStroke: isDark ? 'var(--chakra-colors-avito-blue-400)' : 'var(--chakra-colors-avito-blue-500)',
        radarFill: isDark ? 'var(--chakra-colors-avito-blue-400)' : 'var(--chakra-colors-avito-blue-500)',
    };

    const formatLabel = (value: string) => {
        if (value.length > 10) {
            return value.substring(0, 8) + '...';
        }
        return value;
    };

    return (
        <Card.Root 
            p={4} 
            variant='outline' 
            bg='background.primary'
            borderColor='border.default'
            height='100%'
        >
            <VStack gap={4} align='stretch' height='100%'>
                <HStack justify='space-between' align='center'>
                    <Text 
                        fontSize='lg' 
                        fontWeight='semibold' 
                        color='text.primary'
                    >
                        Радар категорий
                    </Text>
                </HStack>
                <Box flex={1} minH='300px'>
                    <ResponsiveContainer width='100%' height='100%'>
                        <RadarChart cx='50%' cy='50%' outerRadius='80%' data={chartData}>
                            <PolarGrid stroke={chartColors.grid} />
                            <PolarAngleAxis 
                                dataKey='subject' 
                                tick={{
                                    fontSize: 11, 
                                    fill: chartColors.axisText,
                                }}
                                tickFormatter={formatLabel}
                            />
                            <PolarRadiusAxis 
                                angle={30} 
                                domain={[0, 'dataMax']} 
                                tick={{fill: chartColors.axisText}}
                            />
                            <Radar
                                name='Количество'
                                dataKey='A'
                                stroke={chartColors.radarStroke}
                                fill={chartColors.radarFill}
                                fillOpacity={0.6}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: chartColors.tooltipBg,
                                    border: `1px solid ${chartColors.tooltipBorder}`,
                                    borderRadius: '8px',
                                    color: chartColors.tooltipText,
                                }}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </Box>
            </VStack>
        </Card.Root>
    );
});