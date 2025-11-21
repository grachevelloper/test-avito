import {Card, Text, Stack, Box, HStack} from '@chakra-ui/react';
import {observer} from 'mobx-react-lite';
import {PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip} from 'recharts';

// Цвета Авито
const AVITO_COLORS = ['#1E88E5', '#FF7043', '#43A047', '#FDD835', '#5E35B1', '#E53935'];

interface DecisionsChartProps {
    data: any;
}

export const DecisionsChart = observer(({data}: DecisionsChartProps) => {
    if (!data) return null;

    const pieData = data.labels.map((label: string, index: number) => ({
        name: label,
        value: data.datasets[0].data[index] || 0,
    }));

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
                fill='white' 
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
        <Card.Root p={4} variant='outline' bg='white'>
            <Stack gap={4}>
                <HStack justify='space-between' align='center'>
                    <Text fontSize='lg' fontWeight='semibold' color='gray.800'>
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
                                {pieData.map((_, index: number) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={AVITO_COLORS[index % AVITO_COLORS.length]}
                                        stroke='#fff'
                                        strokeWidth={2}
                                    />
                                ))}
                            </Pie>
                            <Tooltip 
                                formatter={(value: number) => [`${value} решений`, 'Количество']}
                                contentStyle={{
                                    backgroundColor: 'white',
                                    border: '1px solid #E2E8F0',
                                    borderRadius: '8px',
                                }}
                            />
                            <Legend 
                                verticalAlign='bottom' 
                                height={36}
                                formatter={(value) => <span style={{color: '#2D3748', fontSize: '12px'}}>{value}</span>}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </Box>
            </Stack>
        </Card.Root>
    );
});