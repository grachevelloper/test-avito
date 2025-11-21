import {Box, Flex, HStack, Link, Button} from '@chakra-ui/react';
import React from 'react';
import {Link as RouterLink, useLocation} from 'react-router-dom';


export const Navigation: React.FC = () => {
    const location = useLocation();
    // const {isDark, toggleTheme} = useTheme();

    const navItems = [
        {path: '/list', label: 'Список объявлений'},
        {path: '/stats', label: 'Статистика'},
    ];

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.currentTarget.blur();
    };

    return (
        <Box borderBottom='1px' borderColor='border.default' bg='background.primary'>
            <Flex
                h='16'
                alignItems='center'
                justifyContent='space-between'
                px={6}
                maxWidth='1200px'
                mx='auto'
            >
                <HStack gap={8}>
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            asChild
                            fontWeight='medium'
                            color={location.pathname === item.path ? 'primary.DEFAULT' : 'text.secondary'}
                            outline='none'
                            _hover={{
                                color: 'primary.DEFAULT',
                                textDecoration: 'none',
                            }}
                            _active={{
                                color: 'primary.pressed',
                            }}
                            _focus={{
                                boxShadow: 'none',
                            }}
                        >
                            <RouterLink to={item.path} onClick={handleClick}>
                                {item.label}
                            </RouterLink>
                        </Link>
                    ))}
                </HStack>

                <Button
                    // onClick={toggleTheme}
                    variant='outline'
                    size='sm'
                    borderColor='border.DEFAULT'
                    color='text.secondary'
                    _hover={{
                        bg: 'background.tertiary',
                        color: 'text.primary',
                    }}
                >
                    {true ? '🌙' : '☀️'}
                </Button>
            </Flex>
        </Box>
    );
};