import {Card, Text, Stack, HStack} from '@chakra-ui/react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'filled' | 'outline';
  icon?: string;
}

export const MetricCard = ({
    title,
    value,
    subtitle,
    color = 'primary',
    size = 'medium',
    variant = 'default',
    icon,
}: MetricCardProps) => {
    const colorSchemes = {
        primary: {
            bg: variant === 'filled' ? 'primary.default' : 'transparent',
            color: variant === 'filled' ? 'text.inverse' : 'primary.default',
            border: 'primary.default',
            subtitle: variant === 'filled' ? 'text.inverse' : 'text.secondary',
        },
        secondary: {
            bg: variant === 'filled' ? 'secondary.default' : 'transparent',
            color: variant === 'filled' ? 'text.inverse' : 'secondary.default',
            border: 'secondary.default',
            subtitle: variant === 'filled' ? 'text.inverse' : 'text.secondary',
        },
        success: {
            bg: variant === 'filled' ? 'status.success' : 'transparent',
            color: variant === 'filled' ? 'text.inverse' : 'status.success',
            border: 'status.success',
            subtitle: variant === 'filled' ? 'text.inverse' : 'text.secondary',
        },
        error: {
            bg: variant === 'filled' ? 'status.error' : 'transparent',
            color: variant === 'filled' ? 'text.inverse' : 'status.error',
            border: 'status.error',
            subtitle: variant === 'filled' ? 'text.inverse' : 'text.secondary',
        },
        warning: {
            bg: variant === 'filled' ? 'status.warning' : 'transparent',
            color: variant === 'filled' ? 'text.primary' : 'status.warning',
            border: 'status.warning',
            subtitle: variant === 'filled' ? 'text.primary' : 'text.secondary',
        },
        info: {
            bg: variant === 'filled' ? 'status.info' : 'transparent',
            color: variant === 'filled' ? 'text.inverse' : 'status.info',
            border: 'status.info',
            subtitle: variant === 'filled' ? 'text.inverse' : 'text.secondary',
        },
    };

    const schemes = colorSchemes[color];
    
    const sizes = {
        small: {
            padding: 3,
            valueSize: 'lg',
            titleSize: 'xs',
        },
        medium: {
            padding: 4,
            valueSize: 'xl',
            titleSize: 'sm',
        },
        large: {
            padding: 6,
            valueSize: '2xl',
            titleSize: 'md',
        },
    };

    const sizeConfig = sizes[size];

    return (
        <Card.Root 
            p={sizeConfig.padding} 
            height='100%'
            variant={variant === 'outline' ? 'outline' : 'elevated'}
            bg={schemes.bg}
            borderColor={variant === 'outline' ? schemes.border : 'transparent'}
            boxShadow={variant === 'filled' ? 'none' : 'sm'}
            transition='all 0.2s ease-in-out'
            _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'lg',
            }}
        >
            <Stack gap={2}>
                <HStack justify='space-between' align='flex-start'>
                    <Text 
                        fontSize={sizeConfig.titleSize} 
                        fontWeight='medium'
                        color={schemes.subtitle}
                    >
                        {title}
                    </Text>
                    {icon && (
                        <Text fontSize={sizeConfig.titleSize} opacity={0.8}>
                            {icon}
                        </Text>
                    )}
                </HStack>
                
                <Text 
                    fontSize={sizeConfig.valueSize} 
                    fontWeight='bold' 
                    color={schemes.color}
                    lineHeight={1.1}
                >
                    {value}
                </Text>
                
                {subtitle && (
                    <Text 
                        fontSize='xs' 
                        color={schemes.subtitle}
                        opacity={0.8}
                    >
                        {subtitle}
                    </Text>
                )}
            </Stack>
        </Card.Root>
    );
};