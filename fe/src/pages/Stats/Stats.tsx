import {
    Box,
    Center,
    Container,
    Flex,
    Grid,
    Heading,
    Stack,
    Text,
} from '@chakra-ui/react';
import {observer} from 'mobx-react-lite';
import {useEffect, useState} from 'react';

import {GlobalProgress} from '@/shared/components/GlobalProgress';
import {LoadingState} from '@/shared/components/LoadingState';
import {useLoadingProgress} from '@/shared/hooks/useLoadingProgress';
import {statsStore} from '@/store/stats';

import {ActivityChart} from './components/ActivityChart';
import {CategoriesChart} from './components/CategoriesChart';
import {DecisionsChart} from './components/DecisionsChart';
import {StatsMetrics} from './components/StatsMetrics';
import {StatsPeriodFilter} from './components/StatsPeriodFilter';

export const StatsPage = observer(() => {
    const [selectedPeriod, setSelectedPeriod] = useState('week');
    const {progress, isLoading, startLoading, completeLoading, stepProgress} = useLoadingProgress();

    useEffect(() => {
        const loadData = async () => {
            startLoading();
            
            try {
                stepProgress(2, 1);
                await statsStore.fetchSummary(selectedPeriod);
                
                stepProgress(2, 2);
                await statsStore.fetchCharts(selectedPeriod);
                
                completeLoading();
            } catch  {
                completeLoading();
            }
        };

        loadData();
    }, [selectedPeriod, startLoading, completeLoading, stepProgress]);

    const handlePeriodChange = (period: string) => {
        setSelectedPeriod(period);
    };

    return (
        <Box padding={6} minH='100vh'             bg='background.primary'>
            <Container maxW='container.xl'>
                <Stack gap={6}>
                    <GlobalProgress progress={progress} isVisible={isLoading} />

                    <Flex justify='space-between' align='center'>
                        <Heading size='xl'>Статистика модератора</Heading>
                    </Flex>

                    <StatsPeriodFilter
                        selectedPeriod={selectedPeriod}
                        onPeriodChange={handlePeriodChange}
                    />

                    {statsStore.loading ? (
                        <LoadingState 
                            progress={progress}
                            title='Загрузка статистики'
                            showPercentage={true}
                            size='md'
                        />
                    ) : statsStore.error ? (
                        <Center py={10}>
                            <Text fontSize='lg' color='red.500'>
                                {statsStore.error}
                            </Text>
                        </Center>
                    ) : (
                        <>
                            <StatsMetrics />

                            <Grid 
                                templateColumns={{
                                    base: '1fr',
                                    md: '1fr 1fr',
                                    lg: '2fr 1fr',
                                    xl: '3fr 1fr 1fr',
                                }} 
                                templateRows={{
                                    base: 'repeat(3, auto)',
                                    md: 'repeat(2, auto)',
                                    lg: 'auto auto',
                                    xl: 'auto',
                                }}
                                gap={6}
                            >
                                <Box 
                                    gridColumn={{
                                        base: '1',
                                        md: '1 / 3',
                                        lg: '1 / 3',
                                        xl: '1',
                                    }}
                                    gridRow={{
                                        base: '1',
                                        md: '1',
                                        lg: '1',
                                        xl: '1',
                                    }}
                                >
                                    <ActivityChart data={statsStore.activityChart}/>
                                </Box>
                                
                                <Box 
                                    gridColumn={{
                                        base: '1',
                                        md: '1',
                                        lg: '1',
                                        xl: '2',
                                    }}
                                    gridRow={{
                                        base: '2',
                                        md: '2',
                                        lg: '2',
                                        xl: '1',
                                    }}
                                >
                                    <DecisionsChart data={statsStore.decisionsChart} />
                                </Box>
                                
                                <Box 
                                    gridColumn={{
                                        base: '1',
                                        md: '2',
                                        lg: '2',
                                        xl: '3',
                                    }}
                                    gridRow={{
                                        base: '3',
                                        md: '2',
                                        lg: '2',
                                        xl: '1',
                                    }}
                                >
                                    <CategoriesChart data={statsStore.categoriesChart} />
                                </Box>
                            </Grid>
                        </>
                    )}
                </Stack>
            </Container>
        </Box>
    );
});