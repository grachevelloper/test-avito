import {Box, Container, VStack} from '@chakra-ui/react';
import {observer} from 'mobx-react-lite';

import {LoadingState} from '../../shared/components/LoadingState';

import {AdActionsSection} from './components/AdActionsSection';
import {AdContentGrid} from './components/AdContentGrid';
import {AdDescription} from './components/AdDescription';
import {AdErrorState} from './components/AdErrorState';
import {AlertNotification} from './components/AlertNotification';
import {RejectDialog} from './components/RejectDialog';
import {useAdDetail} from './hooks/useAdDetail';

export const AdsDetails = observer(() => {
    const {
        selectedReasons,
        customReason,
        isNavigating,
        isInitialized,
        actionLoading,
        alert,
        isAlertVisible,
        isRejectDialogOpen,
        setIsRejectDialogOpen,
        setCustomReason,
        handleBackToList,
        handlePrevious,
        handleNext,
        handleApprove,
        handleRejectSubmit,
        handleReturnForRevision,
        handleReasonChange,
        handlePopoverClose,
        canGoPrevious,
        canGoNext,
        isSubmitDisabled,
        ad,
        loading,
    } = useAdDetail();

    if (!isInitialized || (loading && !ad)) {
        return <LoadingState />;
    }

    if (!ad) {
        return <AdErrorState />;
    }

    return (
        <Box padding={6} background='gray.50' minH='100vh'>
            <Container maxW='container.xl'>
                <AlertNotification alert={alert} isVisible={isAlertVisible} />

                <RejectDialog
                    isOpen={isRejectDialogOpen}
                    onOpenChange={(details) => setIsRejectDialogOpen(details.open)}
                    selectedReasons={selectedReasons}
                    customReason={customReason}
                    onReasonChange={handleReasonChange}
                    onCustomReasonChange={setCustomReason}
                    onSubmit={handleRejectSubmit}
                    isSubmitDisabled={isSubmitDisabled}
                    loading={actionLoading === 'reject'}
                    disabled={ad?.status === 'rejected'}
                />

                <VStack gap={6} align='stretch'>
                    <AdContentGrid
                        images={ad.images || []}
                        moderationHistory={(ad.moderationHistory || []).map(
                            ({action, moderatorName, comment, timestamp}) => ({
                                action,
                                moderatorName,
                                comment,
                                timestamp,
                            }),
                        )}
                        category={ad.category}
                        price={ad.price}
                        status={ad.status}
                        priority={ad.priority}
                        createdAt={ad.createdAt}
                        seller={ad.seller}
                    />

                    <AdDescription description={ad.description} />

                    <AdActionsSection
                        onApprove={handleApprove}
                        onReject={handleRejectSubmit}
                        onReturnForRevision={handleReturnForRevision}
                        selectedReasons={selectedReasons}
                        customReason={customReason}
                        onReasonChange={handleReasonChange}
                        onCustomReasonChange={setCustomReason}
                        onPopoverClose={handlePopoverClose}
                        isSubmitDisabled={isSubmitDisabled}
                        loadingAction={actionLoading}
                        currentAdStatus={ad?.status}
                        onBackToList={handleBackToList}
                        onPrevious={handlePrevious}
                        onNext={handleNext}
                        canGoPrevious={canGoPrevious()}
                        canGoNext={canGoNext()}
                        isNavigating={isNavigating}
                    />
                </VStack>
            </Container>
        </Box>
    );
});
