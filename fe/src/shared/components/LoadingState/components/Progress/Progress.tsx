// components/Progress.tsx
import {Box} from '@chakra-ui/react';
import {keyframes} from '@emotion/react';
import {ReactNode} from 'react';

interface ProgressProps {
    value: number;
    size?: 'xs' | 'sm' | 'md' | 'lg';
    colorScheme?: 'blue' | 'green' | 'red' | 'purple';
    hasStripe?: boolean;
    isAnimated?: boolean;
    position?: 'fixed' | 'absolute' | 'relative';
    children?: ReactNode;
}

export const Progress = ({
    value,
    size = 'md',
    colorScheme = 'blue',
    hasStripe = false,
    isAnimated = false,
    position = 'relative',
    children,
    ...props
}: ProgressProps) => {
    // Высота в зависимости от размера
    const heightMap = {
        xs: '2px',
        sm: '4px',
        md: '6px',
        lg: '8px',
    };

    // Цвета в зависимости от схемы
    const colorMap = {
        blue: {bg: 'blue.50', fill: 'blue.500'},
        green: {bg: 'green.50', fill: 'green.500'},
        red: {bg: 'red.50', fill: 'red.500'},
        purple: {bg: 'purple.50', fill: 'purple.500'},
    };

    // Анимация для полосок
    const stripeAnimation = keyframes`
        0% { background-position: 0 0; }
        100% { background-position: 20px 0; }
    `;

    const stripeBackground = `linear-gradient(
        45deg,
        transparent 25%,
        rgba(255,255,255,0.3) 25%,
        rgba(255,255,255,0.3) 50%,
        transparent 50%,
        transparent 75%,
        rgba(255,255,255,0.3) 75%,
        rgba(255,255,255,0.3)
    )`;
    
    const stripeSize = '20px';
    const animation = `${stripeAnimation} 1s linear infinite`;

    return (
        <Box
            position={position}
            width='100%'
            height={heightMap[size]}
            backgroundColor={colorMap[colorScheme].bg}
            borderRadius='full'
            overflow='hidden'
            {...props}
        >
            <Box
                height='100%'
                width={`${Math.max(0, Math.min(100, value))}%`}
                backgroundColor={colorMap[colorScheme].fill}
                borderRadius='full'
                transition='width 0.3s ease'
                backgroundImage={hasStripe ? stripeBackground : 'none'}
                backgroundSize={hasStripe ? `${stripeSize} ${stripeSize}` : 'auto'}
                animation={hasStripe && isAnimated ? animation : 'none'}
            />
            {children}
        </Box>
    );
};