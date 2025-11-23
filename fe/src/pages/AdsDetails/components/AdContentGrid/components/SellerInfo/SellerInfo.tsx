import {VStack, HStack, Text, Card, Heading, Box, Progress} from '@chakra-ui/react';

interface SellerInfoProps {
    registeredAt?: string;
    name?: string;
    rating?: number;
    totalAds?: number;
}

export const SellerInfo = ({
    name,
    rating = 0,
    totalAds = 0,
    registeredAt,
}: SellerInfoProps) => (
    <Card.Root>
        <Card.Body>
            <Heading size='md' mb={4}>
                Информация о продавце
            </Heading>
            <VStack gap={4} align='stretch'>
                <HStack justify='space-between' paddingY={2} borderBottom='1px solid' borderColor='gray.100'>
                    <Text fontWeight='semibold' fontSize='sm' color='gray.600'>
                        Имя
                    </Text>
                    <Text fontWeight='medium'>{name || 'Не указано'}</Text>
                </HStack>
                
                <Box paddingY={2} borderBottom='1px solid' borderColor='gray.100'>
                    <HStack justify='space-between' mb={1}>
                        <Text fontWeight='semibold' fontSize='sm' color='gray.600'>
                            Рейтинг
                        </Text>
                        <Text fontWeight='medium'>
                            {rating ? `${rating}/5.0` : 'Нет рейтинга'}
                        </Text>
                    </HStack>
                    {rating > 0 && (
                        <Progress.Root 
                            value={rating * 20} 
                            size='sm' 
                            backgroundColor='gray.100'
                            borderRadius='full'
                            mt={1}
                        >
                            <Progress.Track backgroundColor='gray.100'>
                                <Progress.Range backgroundColor='yellow.400' />
                            </Progress.Track>
                        </Progress.Root>
                    )}
                </Box>
                
                <HStack justify='space-between' paddingY={2} borderBottom='1px solid' borderColor='gray.100'>
                    <Text fontWeight='semibold' fontSize='sm' color='gray.600'>
                        Объявления
                    </Text>
                    <Text fontWeight='medium' color={totalAds > 0 ? 'blue.600' : 'gray.500'}>
                        {totalAds || 0}
                    </Text>
                </HStack>
                
                <HStack justify='space-between' paddingY={2}>
                    <Text fontWeight='semibold' fontSize='sm' color='gray.600'>
                        Регистрация
                    </Text>
                    <Text>
                        {registeredAt
                            ? new Date(registeredAt).toLocaleDateString('ru-RU')
                            : 'Не указана'}
                    </Text>
                </HStack>
            </VStack>
        </Card.Body>
    </Card.Root>
);