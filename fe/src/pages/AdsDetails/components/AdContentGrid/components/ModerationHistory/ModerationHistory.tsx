import {
    VStack,
    HStack,
    Text,
    Badge,
    Card,
    Heading,
    Box,
} from '@chakra-ui/react';

interface ModerationHistoryItem {
  moderatorName: string;
  timestamp: string;
  action: 'approved' | 'rejected' | 'changes_requested' | string;
  comment?: string;
}

interface ModerationHistoryProps {
  history: ModerationHistoryItem[];
}

export const ModerationHistory = ({history}: ModerationHistoryProps) => (
    <Card.Root>
        <Card.Body>
            <Heading size='md' mb={4}>
                История модерации
            </Heading>
            
            {history && history.length > 0 ? (
                <VStack gap={2} align='stretch' maxHeight='300px' overflowY='auto'>
                    {history.map((item, index) => (
                        <Box
                            key={index}
                            borderLeft='3px solid'
                            borderLeftColor={
                                item.action === 'approved'
                                    ? 'green.500'
                                    : item.action === 'rejected'
                                        ? 'red.500'
                                        : 'orange.500'
                            }
                            paddingLeft={3}
                            paddingY={2}
                        >
                            <HStack justify='space-between' mb={1}>
                                <Text fontWeight='semibold' fontSize='sm'>
                                    {item.moderatorName}
                                </Text>
                                <Badge
                                    colorPalette={
                                        item.action === 'approved'
                                            ? 'green'
                                            : item.action === 'rejected'
                                                ? 'red'
                                                : 'orange'
                                    }
                                    size='sm'
                                >
                                    {item.action === 'approved'
                                        ? 'Одобрено'
                                        : item.action === 'rejected'
                                            ? 'Отклонено'
                                            : 'На доработку'}
                                </Badge>
                            </HStack>
                            
                            <Text color='gray.500' fontSize='xs' mb={1}>
                                {new Date(item.timestamp).toLocaleString('ru-RU')}
                            </Text>
                            
                            {item.comment && (
                                <Box 
                                    backgroundColor='gray.50' 
                                    padding={2} 
                                    borderRadius='md' 
                                    mt={1}
                                >
                                    <Text fontSize='sm' color='gray.700'>
                                        {item.comment}
                                    </Text>
                                </Box>
                            )}
                        </Box>
                    ))}
                </VStack>
            ) : (
                <Box
                    display='flex'
                    alignItems='center'
                    justifyContent='center'
                    padding={6}
                    backgroundColor='gray.50'
                    borderRadius='md'
                >
                    <Text color='gray.500' fontSize='md' textAlign='center'>
                        Нет записей
                    </Text>
                </Box>
            )}
        </Card.Body>
    </Card.Root>
);