import {
    Button,
    Card,
    Text,
    Box,
    HStack,
    VStack,
    Image,
} from '@chakra-ui/react';
import {useNavigate} from 'react-router-dom';

type AdsInformation = {
  id: string;
  images: string[];
  title: string;
  price: number;
  category: string;
  date: string;
  status: string;
  priority: string;
};

type AdsProps = {
  adsInformation: AdsInformation;
};

export const AdsCard = ({adsInformation}: AdsProps) => {
    const navigate = useNavigate();

    let statusText = '';
    let statusBackground = '';
    let statusColor = '';

    switch (adsInformation.status) {
    case 'rejected':
        statusText = 'Отклонено';
        statusBackground = '{colors.status.error}';
        statusColor = '{colors.white}';
        break;
    case 'approved':
        statusText = 'Одобрено';
        statusBackground = '{colors.status.success}';
        statusColor = '{colors.white}';
        break;
    case 'pending':
        statusText = 'На модерации';
        statusBackground = '{colors.status.warning}';
        statusColor = '{colors.white}';
        break;
    case 'draft':
        statusText = 'На доработке';
        statusBackground = '{colors.avito.orange.300}';
        statusColor = '{colors.avito.gray.900}';
        break;
    default:
        statusText = adsInformation.status;
        statusBackground = '{colors.background.tertiary}';
        statusColor = '{colors.text.primary}';
    }

    let priorityText = '';
    let priorityBackground = '';
    let priorityColor = '';

    switch (adsInformation.priority) {
    case 'urgent':
        priorityText = 'Срочный';
        priorityBackground = '{colors.status.error}';
        priorityColor = '{colors.white}';
        break;
    case 'normal':
        priorityText = 'Обычный';
        priorityBackground = '{colors.avito.blue.400}';
        priorityColor = '{colors.white}';
        break;
    default:
        priorityText = adsInformation.priority;
        priorityBackground = '{colors.background.tertiary}';
        priorityColor = '{colors.text.primary}';
    }

    const handleOpenClick = () => {
        navigate(`/item/${adsInformation.id}`);
    };

    const hanleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        navigate(`/item/${adsInformation.id}`);
    };

    return (
        <Card.Root
            overflow='hidden'
            width='100%'
            onClick={handleOpenClick}
            cursor='pointer'
            transition='all 0.2s ease-in-out'
            borderRadius='12px'
            border='1px solid {colors.border.default}'
            _hover={{
                transform: 'translateY(-4px)',
                boxShadow: 'lg',
                borderColor: '{colors.border.focused}',
            }}
        >
            <Box
                display='flex'
                flexDirection={{base: 'column', md: 'row'}}
                height='full'
                transition='all 0.2s ease-in-out'
            >
                <Box
                    flexShrink='0'
                    width={{base: '100%', md: '200px'}}
                    height={{base: '170px', md: 'auto'}}
                    aspectRatio={{base: 'auto', md: '1'}}
                    position='relative'
                    overflow='hidden'
                    backgroundColor='{colors.background.tertiary}'
                    transition='all 0.3s ease-in-out'
                    _hover={{
                        '& img': {
                            transform: 'scale(1.05)',
                        },
                    }}
                >
                    {
                        false && adsInformation.images &&
          adsInformation.images.length > 0 ? (
                                <Image
                                    src={adsInformation.images[0]}
                                    alt={adsInformation.title}
                                    width='100%'
                                    height='100%'
                                    objectFit='cover'
                                    transition='transform 0.3s ease-in-out'
                                />
                            ) : (
                                <Box
                                    display='flex'
                                    alignItems='center'
                                    justifyContent='center'
                                    height='100%'
                                    transition='all 0.2s ease-in-out'
                                >
                                    <Text fontSize='md' textAlign='center' fontWeight='medium' color='{colors.text.tertiary}'>
                Фотография
                                    </Text>
                                </Box>
                            )}
                </Box>

                <Box
                    display='flex'
                    flexDirection={{base: 'column', md: 'row'}}
                    flex='1'
                    padding='5'
                    gap='4'
                    minHeight='0'
                    transition='all 0.2s ease-in-out'
                >
                    <Box flex='1' display='flex' flexDirection='column' gap='3'>
                        <VStack
                            align='start'
                            gap='3'
                            flex='1'
                            justifyContent='space-between'
                        >
                            <Card.Title
                                fontSize={{base: 'lg', md: 'xl'}}
                                lineHeight='tight'
                                color='{colors.text.primary}'
                                transition='color 0.2s ease-in-out'
                                _hover={{
                                    color: '{colors.primary.default}',
                                }}
                            >
                                {adsInformation.title}
                            </Card.Title>

                            <Text
                                fontSize={{base: '2xl', md: '3xl'}}
                                fontWeight='bold'
                                color='{colors.primary.default}'
                                transition='all 0.2s ease-in-out'
                                _hover={{
                                    transform: 'scale(1.02)',
                                }}
                            >
                                {adsInformation.price}₽
                            </Text>

                            <HStack gap='4' justify='start' width='auto'>
                                <Box>
                                    <Box
                                        display='flex'
                                        flexDirection={{base: 'column', sm: 'row'}}
                                        alignItems={{base: 'start', sm: 'baseline'}}
                                        gap={{base: 0, sm: 1}}
                                    >
                                        <Text fontSize='sm' color='{colors.text.tertiary}'>
                      Категория:
                                        </Text>
                                        <Text
                                            fontSize='md'
                                            fontWeight='semibold'
                                            color='{colors.text.primary}'
                                            transition='color 0.2s ease-in-out'
                                            _hover={{
                                                color: '{colors.primary.default}',
                                            }}
                                        >
                                            {adsInformation.category}
                                        </Text>
                                    </Box>
                                </Box>
                                <Box>
                                    <Box
                                        display='flex'
                                        flexDirection={{base: 'column', sm: 'row'}}
                                        alignItems={{base: 'start', sm: 'baseline'}}
                                        gap={{base: 0, sm: 1}}
                                    >
                                        <Text fontSize='sm' color='{colors.text.tertiary}'>
                      Дата создания:
                                        </Text>
                                        <Text
                                            fontSize='md'
                                            fontWeight='medium'
                                            color='{colors.text.secondary}'
                                            transition='color 0.2s ease-in-out'
                                            _hover={{
                                                color: '{colors.text.primary}',
                                            }}
                                        >
                                            {adsInformation.date}
                                        </Text>
                                    </Box>
                                </Box>
                            </HStack>

                            <HStack gap='3' justify='start' width='auto'>
                                <Text
                                    fontSize='sm'
                                    fontWeight='medium'
                                    backgroundColor={statusBackground}
                                    color={statusColor}
                                    paddingX='3'
                                    paddingY='1'
                                    borderRadius='6px'
                                    transition='all 0.2s ease-in-out'
                                    _hover={{
                                        transform: 'scale(1.05)',
                                        filter: 'brightness(1.1)',
                                    }}
                                >
                                    {statusText}
                                </Text>
                                <Text
                                    fontSize='sm'
                                    fontWeight='medium'
                                    backgroundColor={priorityBackground}
                                    color={priorityColor}
                                    paddingX='3'
                                    paddingY='1'
                                    borderRadius='6px'
                                    transition='all 0.2s ease-in-out'
                                    _hover={{
                                        transform: 'scale(1.05)',
                                        filter: 'brightness(1.1)',
                                    }}
                                >
                                    {priorityText}
                                </Text>
                            </HStack>
                        </VStack>
                    </Box>

                    <Box
                        alignSelf={{base: 'stretch', md: 'flex-end'}}
                        width={{base: 'full', md: 'auto'}}
                        transition='all 0.2s ease-in-out'
                    >
                        <Button
                            onClick={hanleButtonClick}
                            variant='solid'
                            bg='{colors.secondary.default}'
                            color='{colors.text.inverse}'
                            size='md'
                            width={{base: 'full', md: 'auto'}}
                            minWidth='120px'
                            fontWeight='semibold'
                            borderRadius='8px'
                            _hover={{
                                backgroundColor: '{colors.secondary.hover}',
                                transform: 'translateY(-2px)',
                                boxShadow: 'lg',
                            }}
                            _active={{
                                transform: 'translateY(0)',
                            }}
                            transition='all 0.125s ease-in-out'
                        >
              Открыть
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Card.Root>
    );
};
