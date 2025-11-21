import {useState, useCallback} from 'react';

export const useLoadingProgress = () => {
    const [progress, setProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const startLoading = useCallback(() => {
        setIsLoading(true);
        setProgress(0);
    }, []);

    const updateProgress = useCallback((value: number) => {
        setProgress(Math.min(100, Math.max(0, value)));
    }, []);

    const completeLoading = useCallback(() => {
        setProgress(100);
        setTimeout(() => {
            setIsLoading(false);
            setProgress(0);
        }, 500);
    }, []);

    const stepProgress = useCallback((steps: number, currentStep: number) => {
        const stepValue = 100 / steps;
        updateProgress(stepValue * currentStep);
    }, [updateProgress]);

    return {
        progress,
        isLoading,
        startLoading,
        updateProgress,
        completeLoading,
        stepProgress,
    };
};