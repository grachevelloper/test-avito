import {
    Dialog,
    VStack,
    HStack,
    Heading,
    Textarea,
    Checkbox,
    Box,
    Text,
    Button,
} from '@chakra-ui/react';

import {rejectionReasons} from '@/shared/utils/constants';

interface RejectDialogProps {
  isOpen: boolean;
  onOpenChange: (details: { open: boolean }) => void;
  selectedReasons: string[];
  customReason: string;
  onReasonChange: (reason: string, checked: boolean) => void;
  onCustomReasonChange: (reason: string) => void;
  onSubmit: () => void;
  isSubmitDisabled: boolean;
  loading?: boolean;
  disabled?: boolean;
}

export const RejectDialog = ({
    isOpen,
    onOpenChange,
    selectedReasons,
    customReason,
    onReasonChange,
    onCustomReasonChange,
    onSubmit,
    isSubmitDisabled,
    loading,
    disabled,
}: RejectDialogProps) => {
    const handleClose = () => {
        onOpenChange({open: false});
    };

    const handleSubmit = () => {
        onSubmit();
    };

    const handleCancel = () => {
        handleClose();
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content 
                    width='420px' 
                    maxWidth='90vw'
                    borderRadius='12px'
                    boxShadow='xl'
                >
                    <Dialog.Header
                        borderBottom='1px solid {colors.border.default}'
                        padding='4'
                    >
                        <Dialog.Title>
                            <Heading size='md' color='{colors.text.primary}'>
                                Укажите причину отклонения
                            </Heading>
                        </Dialog.Title>
                    </Dialog.Header>

                    <Dialog.Body padding={5}>
                        <VStack gap={4} align='stretch' width='100%'>
                            <VStack
                                gap={3}
                                align='stretch'
                                maxHeight='200px'
                                overflowY='auto'
                                padding='1'
                            >
                                {rejectionReasons.map((reason) => (
                                    <Checkbox.Root
                                        key={reason}
                                        checked={selectedReasons.includes(reason)}
                                        onCheckedChange={(details) =>
                                            onReasonChange(reason, details.checked === true)
                                        }
                                    >
                                        <Checkbox.HiddenInput />
                                        <Checkbox.Control 
                                            colorPalette='red'
                                        />
                                        <Checkbox.Label 
                                            fontSize='sm' 
                                            whiteSpace='nowrap'
                                            color='{colors.text.primary}'
                                        >
                                            {reason}
                                        </Checkbox.Label>
                                    </Checkbox.Root>
                                ))}
                            </VStack>

                            {selectedReasons.includes('Другое') && (
                                <Box>
                                    <Text fontWeight='semibold' mb={2} fontSize='sm' color='{colors.text.primary}'>
                                        Укажите причину
                                    </Text>
                                    <Textarea
                                        placeholder='Введите причину отклонения...'
                                        value={customReason}
                                        onChange={(e) => onCustomReasonChange(e.target.value)}
                                        minHeight='80px'
                                        size='sm'
                                        resize='vertical'
                                        borderRadius='8px'
                                        borderColor='{colors.border.default}'
                                        _focus={{
                                            borderColor: '{colors.border.focused}',
                                            boxShadow: '0 0 0 1px {colors.border.focused}',
                                        }}
                                    />
                                </Box>
                            )}
                        </VStack>
                    </Dialog.Body>

                    <Dialog.Footer
                        borderTop='1px solid {colors.border.default}'
                        padding='4'
                    >
                        <HStack gap={3} justify='flex-end' width='100%'>
                            <Button
                                variant='outline'
                                size='sm'
                                onClick={handleCancel}
                                disabled={loading}
                                borderColor='{colors.border.default}'
                                color='{colors.text.secondary}'
                                _hover={{
                                    bg: '{colors.background.tertiary}',
                                }}
                            >
                                Отмена
                            </Button>
                            <Button
                                bg='{colors.status.error}'
                                color='{colors.text.inverse}'
                                onClick={handleSubmit}
                                disabled={isSubmitDisabled || loading || disabled}
                                loading={loading}
                                size='sm'
                                _hover={{
                                    bg: '{colors.status.error}',
                                    filter: 'brightness(0.9)',
                                }}
                                _disabled={{
                                    bg: '{colors.avito.gray.300}',
                                    color: '{colors.avito.gray.500}',
                                }}
                            >
                                Отправить
                            </Button>
                        </HStack>
                    </Dialog.Footer>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    );
};