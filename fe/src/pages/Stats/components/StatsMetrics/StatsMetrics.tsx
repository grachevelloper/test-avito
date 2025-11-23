import {Grid, VStack} from '@chakra-ui/react';
import {observer} from 'mobx-react-lite';

import {statsStore} from '../../../../store/stats';

import {MetricCard} from './components/MetricCard';

export const StatsMetrics = observer(() => {
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}м ${remainingSeconds}с`;
    };

    const totalReviewed = statsStore.summary?.totalReviewed || 0;
    const approvedPercentage = statsStore.summary?.approvedPercentage || 0;
    const rejectedPercentage = statsStore.summary?.rejectedPercentage || 0;

    const approvedCount = Math.round((totalReviewed * approvedPercentage) / 100);
    const rejectedCount = Math.round((totalReviewed * rejectedPercentage) / 100);

    return (
        <VStack gap={6} align='stretch'>
            <MetricCard
                title='Всего проверено объявлений'
                value={totalReviewed.toLocaleString()}
                color='info'
                size='large'
                icon='📊'
                variant='filled'
            />

            <Grid templateColumns='repeat(3, 1fr)' gap={4}>
                <MetricCard
                    title='Одобрено'
                    value={`${approvedPercentage.toFixed(1)}%`}
                    subtitle={`${approvedCount.toLocaleString()} объявлений`}
                    color='success'
                    size='medium'
                    icon='✅'
                />
                <MetricCard
                    title='Отклонено'
                    value={`${rejectedPercentage.toFixed(1)}%`}
                    subtitle={`${rejectedCount.toLocaleString()} объявлений`}
                    color='error'
                    size='medium'
                    icon='❌'
                />
                <MetricCard
                    title='Среднее время проверки'
                    value={formatTime(statsStore.summary?.averageReviewTime || 0)}
                    color='info'
                    icon='⏱️'
                />
            </Grid>
            <Grid templateColumns='repeat(4, 1fr)' gap={3}>
                <MetricCard
                    title='Одобрено'
                    value={approvedCount.toLocaleString()}
                    color='success'
                    size='small'
                    variant='outline'
                />
                <MetricCard
                    title='Отклонено'
                    value={rejectedCount.toLocaleString()}
                    color='error'
                    size='small'
                    variant='outline'
                />
            </Grid>
        </VStack>
    );
});