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

interface CategoriesChartProps {
    data: any;
}

export const CategoriesChart = observer(({data}: CategoriesChartProps) => {
    if (!data) return null;

    const chartData = Object.entries(data)
        .map(([category, count]) => ({
            subject: category,
            A: count as number,
            fullMark: Math.max(...Object.values(data)),
        }))
        .sort((a, b) => b.A - a.A)
        .slice(0, 8); // Берем топ-8 для читаемости

    const formatLabel = (value: string) => {
        if (value.length > 10) {
            return value.substring(0, 8) + '...';
        }
        return value;
    };

    return (
        <Card.Root p={4} variant='outline' bg='white' height='100%'>
            <VStack gap={4} align='stretch' height='100%'>
                <HStack justify='space-between' align='center'>
                    <Text fontSize='lg' fontWeight='semibold' color='gray.800'>
                        Радар категорий
                    </Text>
                </HStack>
                <Box flex={1} minH='300px'>
                    <ResponsiveContainer width='100%' height='100%'>
                        <RadarChart cx='50%' cy='50%' outerRadius='80%' data={chartData}>
                            <PolarGrid stroke='#E2E8F0' />
                            <PolarAngleAxis 
                                dataKey='subject' 
                                tick={{fontSize: 11, fill: '#2D3748'}}
                                tickFormatter={formatLabel}
                            />
                            <PolarRadiusAxis angle={30} domain={[0, 'dataMax']} />
                            <Radar
                                name='Количество'
                                dataKey='A'
                                stroke='#1E88E5'
                                fill='#1E88E5'
                                fillOpacity={0.6}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'white',
                                    border: '1px solid #E2E8F0',
                                    borderRadius: '8px',
                                }}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </Box>
            </VStack>
        </Card.Root>
    );
});