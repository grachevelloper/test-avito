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

const ACTIVITY_COLORS = {
    approved: '#43A047', 
    rejected: '#E53935', 
    requestChanges: '#FFB300', 
};

interface ActivityChartProps {
    data: any;
}

export const ActivityChart = observer(({data}: ActivityChartProps) => {
    if (!data) return null;

    const chartData = data.labels.map((label: string, index: number) => ({
        name: label,
        approved: data.datasets[0].data[index],
        rejected: data.datasets[1]?.data[index] || 0,
        requestChanges: data.datasets[2]?.data[index] || 0,
    }));

    return (
        <Card.Root p={4} variant='outline' bg='white'>
            <Stack gap={4}>
                <HStack justify='space-between' align='center'>
                    <Text fontSize='lg' fontWeight='semibold' color='gray.800'>
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
                                stroke='#E2E8F0'
                            />
                            <XAxis 
                                dataKey='name' 
                                axisLine={false}
                                tickLine={false}
                                tick={{fill: '#718096', fontSize: 12}}
                            />
                            <YAxis 
                                axisLine={false}
                                tickLine={false}
                                tick={{fill: '#718096', fontSize: 12}}
                            />
                            <Tooltip 
                                contentStyle={{
                                    backgroundColor: 'white',
                                    border: '1px solid #E2E8F0',
                                    borderRadius: '8px',
                                }}
                            />
                            <Legend 
                                verticalAlign='top'
                                height={36}
                                formatter={(value) => <span style={{color: '#2D3748', fontSize: '12px'}}>{value}</span>}
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