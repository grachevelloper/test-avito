import {VStack, HStack, Text, Badge, Card, Heading} from '@chakra-ui/react';

interface ProductCharacteristicsProps {
  category?: string;
  price?: number;
  status?: string;
  priority?: string;
  createdAt?: string;
}

export const ProductCharacteristics = ({
    category,
    price,
    status,
    priority,
    createdAt = Date.now().toString(),
}: ProductCharacteristicsProps) => (
    <Card.Root>
        <Card.Body>
            <Heading size='md' mb={4}>
                Характеристики товара
            </Heading>
            <VStack gap={3} align='stretch'>
                <HStack justify='space-between' paddingY={2} borderBottom='1px solid' borderColor='gray.100'>
                    <Text fontWeight='semibold' fontSize='sm' color='gray.600'>
                        Категория
                    </Text>
                    <Text>{category || 'Не указана'}</Text>
                </HStack>
                
                <HStack justify='space-between' paddingY={2} borderBottom='1px solid' borderColor='gray.100'>
                    <Text fontWeight='semibold' fontSize='sm' color='gray.600'>
                        Цена
                    </Text>
                    <Text fontWeight='bold' color='blue.600'>
                        {price ? `${price.toLocaleString('ru-RU')}₽` : 'Не указана'}
                    </Text>
                </HStack>
                
                <HStack justify='space-between' paddingY={2} borderBottom='1px solid' borderColor='gray.100'>
                    <Text fontWeight='semibold' fontSize='sm' color='gray.600'>
                        Статус
                    </Text>
                    <Badge
                        colorPalette={
                            status === 'approved'
                                ? 'green'
                                : status === 'rejected'
                                    ? 'red'
                                    : status === 'draft'
                                        ? 'yellow'
                                        : 'orange'
                        }
                        size='md'
                    >
                        {status === 'approved'
                            ? 'Одобрено'
                            : status === 'rejected'
                                ? 'Отклонено'
                                : status === 'draft'
                                    ? 'На доработке'
                                    : 'На модерации'}
                    </Badge>
                </HStack>
                
                <HStack justify='space-between' paddingY={2} borderBottom='1px solid' borderColor='gray.100'>
                    <Text fontWeight='semibold' fontSize='sm' color='gray.600'>
                        Приоритет
                    </Text>
                    <Badge 
                        colorPalette={priority === 'urgent' ? 'red' : 'blue'}
                        size='md'
                    >
                        {priority === 'urgent' ? 'Срочный' : 'Обычный'}
                    </Badge>
                </HStack>
                
                <HStack justify='space-between' paddingY={2}>
                    <Text fontWeight='semibold' fontSize='sm' color='gray.600'>
                        Дата создания
                    </Text>
                    <Text>
                        {new Date(createdAt).toLocaleDateString('ru-RU')}
                    </Text>
                </HStack>
            </VStack>
        </Card.Body>
    </Card.Root>
);