import {Center, Stack, Text, Box} from '@chakra-ui/react';
import {keyframes} from '@emotion/react';

import {Progress} from './components/Progress';

interface LoadingStateProps {
    progress: number;
    title?: string;
    description?: string;
    showPercentage?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

const pulseAnimation = keyframes`
    0%, 20% { opacity: 0; }
    50% { opacity: 1; }
    100% { opacity: 0; }
`;

export const LoadingState = ({
    progress,
    title = 'Загрузка...',
    description,
    showPercentage = true,
    size = 'md',
}: LoadingStateProps) => {
    const getStatusText = (progress: number) => {
        if (progress < 30) return 'Подготовка данных...';
        if (progress < 60) return 'Загрузка статистики...';
        if (progress < 90) return 'Формирование графиков...';
        return 'Завершение...';
    };

    return (
        <Center py={10} minH='200px'>
            <Stack align='center' gap={4} width='100%' maxW='300px'>
                <Text fontSize='xl' color='blue.500' fontWeight='medium'>
                    {title}
                    <Box
                        as='span'
                        animation={`${pulseAnimation} 1.5s infinite`}
                        display='inline-block'
                        width='1em'
                        textAlign='left'
                    >
                        ...
                    </Box>
                </Text>

                <Box width='100%'>
                    <Progress
                        value={progress}
                        size={size}
                        colorScheme='blue'
                        hasStripe
                        isAnimated
                    />
                </Box>

                <Stack align='center' gap={1} width='100%'>
                    <Text fontSize='sm' color='gray.500' textAlign='center'>
                        {description || getStatusText(progress)}
                    </Text>
                    {showPercentage && (
                        <Text fontSize='sm' color='gray.600' fontWeight='medium'>
                            {Math.round(progress)}%
                        </Text>
                    )}
                </Stack>
            </Stack>
        </Center>
    );
};