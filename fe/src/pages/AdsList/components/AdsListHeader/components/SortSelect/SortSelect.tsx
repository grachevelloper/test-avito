import {Select, Portal, createListCollection} from '@chakra-ui/react';

const sortOptions = createListCollection({
    items: [
        {label: 'Новые сначала', value: 'createdAt_desc'},
        {label: 'Старые сначала', value: 'createdAt_asc'},
        {label: 'Цена по убыванию', value: 'price_desc'},
        {label: 'Цена по возрастанию', value: 'price_asc'},
        {label: 'Приоритетные', value: 'priority_desc'},
    ],
});

interface SortSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

export const SortSelect = ({value, onValueChange}: SortSelectProps) => {
    return (
        <Select.Root
            collection={sortOptions}
            bg='background.default'
            size='sm'
            width='250px'
            value={[value]}
            onValueChange={(details) => onValueChange(details.value[0])}
        >
            <Select.HiddenSelect />
            <Select.Control>
                <Select.Trigger
                    border='border.default'
                    style={{
                        outline: '2px solid {colors.border.default}',
                        borderRadius: '8px',
                        padding: '8px 12px',
                    }}
                >
                    <Select.ValueText placeholder='Сортировка' />
                </Select.Trigger>
                <Select.IndicatorGroup>
                    <Select.Indicator />
                </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
                <Select.Positioner
                    bg='background.default'
                    borderColor='border.default'
                >
                    <Select.Content
                        style={{
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        }}
                        bg='background.default'
                        borderColor='border.default'
                    >
                        {sortOptions.items.map((option) => (
                            <Select.Item 
                                item={option}
                                bg='background.default'
                                borderColor='border.default' 
                                key={option.value}
                                style={{
                                    padding: '8px 12px',
                                }}
                            >
                                {option.label}
                                <Select.ItemIndicator />
                            </Select.Item>
                        ))}
                    </Select.Content>
                </Select.Positioner>
            </Portal>
        </Select.Root>
    );
};