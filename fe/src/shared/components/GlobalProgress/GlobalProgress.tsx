// components/GlobalProgress.tsx
import {Box} from '@chakra-ui/react';
import {keyframes} from '@emotion/react';

interface GlobalProgressProps {
    progress: number;
    isVisible: boolean;
}

// Анимация для полосок
const stripeAnimation = keyframes`
    0% { background-position: 1rem 0; }
    100% { background-position: 0 0; }
`;

export const GlobalProgress = ({progress, isVisible}: GlobalProgressProps) => {
    if (!isVisible) return null;

    return (
        <Box
            position='fixed'
            top='0'
            left='0'
            right='0'
            height='3px'
            backgroundColor='blue.50'
            zIndex='1000'
        >
            <Box
                height='100%'
                width={`${Math.max(0, Math.min(100, progress))}%`}
                backgroundColor='blue.500'
                transition='width 0.3s ease'
                backgroundImage={`linear-gradient(
                    45deg,
                    rgba(255,255,255,0.15) 25%,
                    transparent 25%,
                    transparent 50%,
                    rgba(255,255,255,0.15) 50%,
                    rgba(255,255,255,0.15) 75%,
                    transparent 75%,
                    transparent
                )`}
                backgroundSize='1rem 1rem'
                animation={`${stripeAnimation} 1s linear infinite`}
            />
        </Box>
    );
};