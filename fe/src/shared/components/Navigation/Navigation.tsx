import {Box, Flex, HStack, Link, Button} from '@chakra-ui/react';
import React from 'react';
import {Link as RouterLink, useLocation} from 'react-router-dom';

import {useThemeContext} from './context';

export const Navigation: React.FC = () => {
    const location = useLocation();
    const {resolvedTheme, toggleTheme} = useThemeContext();

    const navItems = [
        {path: '/list', label: 'Список объявлений'},
        {path: '/stats', label: 'Статистика'},
    ];

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.currentTarget.blur();
    };

    return (
        <Box 
            borderBottom='1px' 
            borderColor='border.default' 
            bg='background.primary'
            position='relative'
            zIndex={10}
        >
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
                            color={location.pathname === item.path ? 'primary.default' : 'text.secondary'}
                            outline='none'
                            _hover={{
                                color: 'primary.default',
                                textDecoration: 'none',
                            }}
                            _active={{
                                color: 'primary.pressed',
                            }}
                            _focusVisible={{
                                color: 'primary.default',
                                boxShadow: '0 0 0 2px {colors.border.focused}',
                            }}
                            transition='color 0.2s ease-in-out'
                        >
                            <RouterLink to={item.path} onClick={handleClick}>
                                {item.label}
                            </RouterLink>
                        </Link>
                    ))}
                </HStack>

                <Button
                    onClick={toggleTheme}
                    variant='outline'
                    size='sm'
                    borderColor='border.default'
                    color='text.secondary'
                    bg='background.primary'
                    _hover={{
                        bg: 'background.tertiary',
                        color: 'text.primary',
                        borderColor: 'border.strong',
                    }}
                    _active={{
                        bg: 'background.tertiary',
                        color: 'text.primary',
                    }}
                    _focusVisible={{
                        boxShadow: '0 0 0 2px {colors.border.focused}',
                    }}
                    transition='all 0.2s ease-in-out'
                    aria-label={`Переключить на ${resolvedTheme === 'dark' ? 'светлую' : 'тёмную'} тему`}
                >
                    {resolvedTheme === 'dark' ? '☀️' : '🌙'}
                </Button>
            </Flex>
        </Box>
    );
};