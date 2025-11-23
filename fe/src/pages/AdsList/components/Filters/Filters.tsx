import {
    Box,
    Button,
    Checkbox,
    createListCollection,
    Flex,
    Grid,
    Heading,
    HStack,
    Input,
    Portal,
    Select,
    Stack,
    Text,
    Menu,
    Dialog,
    VStack,
} from '@chakra-ui/react';
import {observer} from 'mobx-react-lite';
import React, {useEffect, useState} from 'react';

import {useThemeContext} from '@/shared/components/Navigation/context';

import {adsStore} from '../../../../store/ads';

import {useFilterState} from './hooks/useFilters';

interface FiltersProps {
    onFiltersChange?: () => void;
    searchInputRef?: React.RefObject<HTMLInputElement | null>;
    onSearchFocus?: () => void;
    onSearchBlur?: () => void;
}

export const Filters = observer(
    ({
        onFiltersChange,
        searchInputRef,
        onSearchFocus,
        onSearchBlur,
    }: FiltersProps) => {
        const {resolvedTheme} = useThemeContext();
        const isDark = resolvedTheme === 'dark';
        const {
            filters: urlFilters,
            updateURL,
            savedFilters,
            saveFilterSet,
            loadFilterSet,
            deleteFilterSet,
        } = useFilterState((urlFilters) => {
            adsStore.setFilters(urlFilters);
            setSelectedCategory([urlFilters.categoryId || 'all_categories']);
        });

        const [selectedCategory, setSelectedCategory] = React.useState<string[]>([
            urlFilters.categoryId || 'all_categories',
        ]);
        const [saveDialogOpen, setSaveDialogOpen] = useState(false);
        const [filterSetName, setFilterSetName] = useState('');

        useEffect(() => {
            setSelectedCategory([adsStore.filters.categoryId || 'all_categories']);
        }, [adsStore.filters.categoryId]);

        const handleStatusFilterChange = (
            status: string,
            checked: boolean | 'indeterminate',
        ) => {
            const isChecked = checked === true;
            const newStatuses = isChecked
                ? [...adsStore.filters.status, status]
                : adsStore.filters.status.filter((s) => s !== status);
            
            const newFilters = {...adsStore.filters, status: newStatuses};
            adsStore.setFilters(newFilters);
            updateURL(newFilters);
            adsStore.fetchAds(1);
            onFiltersChange?.();
        };

        const handleCategoryChange = (details: { value: string[] }) => {
            const categoryValue = details.value[0];
            setSelectedCategory(details.value);

            const categoryId = categoryValue && categoryValue !== 'all_categories'
                ? categoryValue
                : undefined;

            const newFilters = {...adsStore.filters, categoryId};
            adsStore.setFilters(newFilters);
            updateURL(newFilters);
            adsStore.fetchAds(1);
            onFiltersChange?.();
        };

        const handlePriceMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value ? Number(e.target.value) : undefined;
            adsStore.setFilters({
                ...adsStore.filters,
                minPrice: value,
            });
        };

        const handlePriceMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value ? Number(e.target.value) : undefined;
            adsStore.setFilters({
                ...adsStore.filters,
                maxPrice: value,
            });
        };

        const handlePriceApply = () => {
            updateURL(adsStore.filters);
            adsStore.fetchAds(1);
            onFiltersChange?.();
        };

        const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            adsStore.setFilters({
                ...adsStore.filters,
                search: e.target.value,
            });
        };

        const handleSearchSubmit = () => {
            updateURL(adsStore.filters);
            adsStore.fetchAds(1);
            onFiltersChange?.();
        };

        const handleResetFilters = () => {
            setSelectedCategory(['all_categories']);
            adsStore.resetFilters();
            updateURL(adsStore.resetFilters());
            adsStore.fetchAds(1);
            onFiltersChange?.();
        };

        const handleSaveFilterSet = () => {
            if (filterSetName.trim()) {
                saveFilterSet(filterSetName.trim(), adsStore.filters);
                setFilterSetName('');
                setSaveDialogOpen(false);
            }
        };

        const handleLoadFilterSet = (name: string) => {
            const savedFilters = loadFilterSet(name);
            if (savedFilters) {
                adsStore.setFilters(savedFilters);
                updateURL(savedFilters);
                setSelectedCategory([savedFilters.categoryId || 'all_categories']);
                adsStore.fetchAds(1);
                onFiltersChange?.();
            }
        };

        const handleShareLink = () => {
            const currentUrl = window.location.href;
            navigator.clipboard.writeText(currentUrl).then(() => {
                alert('Ссылка скопирована в буфер обмена!');
            });
        };

        const categories = createListCollection({
            items: [
                {label: 'Все категории', value: 'all_categories'},
                {label: 'Электроника', value: '0'},
                {label: 'Недвижимость', value: '1'},
                {label: 'Транспорт', value: '2'},
                {label: 'Работа', value: '3'},
                {label: 'Услуги', value: '4'},
                {label: 'Животные', value: '5'},
                {label: 'Мода', value: '6'},
                {label: 'Детское', value: '7'},
            ],
        });

        const inputBg = isDark ? 'background.tertiary' : 'background.primary';
        const inputColor = isDark ? 'text.primary' : 'text.primary';
        const borderColor = isDark ? 'border.strong' : 'border.default';
        const placeholderColor = isDark ? 'text.tertiary' : 'text.tertiary';

        return (
            <Box
                backgroundColor='{colors.background.tertiary}'
                padding={5}
                borderRadius='12px'
                boxShadow='md'
                border='1px'
                borderColor='border.strong'
            >
                <Dialog.Root open={saveDialogOpen} onOpenChange={(e) => setSaveDialogOpen(e.open)}>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                        <Dialog.Content
                            bg='background.primary'
                            borderColor='border.strong'
                        >
                            <Dialog.Header>
                                <Dialog.Title color='text.primary'>Сохранить набор фильтров</Dialog.Title>
                            </Dialog.Header>
                            <Dialog.Body>
                                <VStack gap={3}>
                                    <Text color='text.primary'>Введите название для набора фильтров:</Text>
                                    <Input
                                        value={filterSetName}
                                        onChange={(e) => setFilterSetName(e.target.value)}
                                        placeholder="Например: 'На модерации'"
                                        bg={inputBg}
                                        color={inputColor}
                                        borderColor={borderColor}
                                        _placeholder={{color: placeholderColor}}
                                    />
                                </VStack>
                            </Dialog.Body>
                            <Dialog.Footer>
                                <HStack gap={2}>
                                    <Button 
                                        variant='outline' 
                                        onClick={() => setSaveDialogOpen(false)}
                                        borderColor={borderColor}
                                        color='text.primary'
                                    >
                                        Отмена
                                    </Button>
                                    <Button 
                                        onClick={handleSaveFilterSet}
                                        bg='primary.default'
                                        color='text.inverse'
                                    >
                                        Сохранить
                                    </Button>
                                </HStack>
                            </Dialog.Footer>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Dialog.Root>

                <Stack gap={5}>
                    {/* Заголовок и кнопки управления */}
                    <Flex justify='space-between' align='center' direction={{base: 'column', sm: 'row'}} gap={3}>
                        <Heading size='lg' color='primary.default'>
                            Фильтры объявлений
                        </Heading>
                        <HStack gap={2} flexWrap='wrap' justify={{base: 'center', sm: 'flex-end'}}>
                            <Button
                                variant='ghost'
                                onClick={handleResetFilters}
                                color='text.secondary'
                                _hover={{bg: 'background.tertiary', color: 'text.primary'}}
                                size='sm'
                            >
                                Очистить фильтры
                            </Button>
                            <Button
                                variant='outline'
                                onClick={handleShareLink}
                                size='sm'
                                borderColor={borderColor}
                                color='text.primary'
                                _hover={{bg: 'background.tertiary'}}
                            >
                                Поделиться ссылкой
                            </Button>
                            <Menu.Root>
                                <Menu.Trigger asChild>
                                    <Button 
                                        variant='outline' 
                                        size='sm'
                                        borderColor={borderColor}
                                        color='text.primary'
                                        _hover={{bg: 'background.tertiary'}}
                                    >
                                        Сохраненные фильтры
                                    </Button>
                                </Menu.Trigger>
                                <Portal>
                                    <Menu.Positioner>
                                        <Menu.Content
                                            bg='background.primary'
                                            borderColor='border.strong'
                                            boxShadow='lg'
                                        >
                                            {Object.keys(savedFilters).length === 0 ? (
                                                <Menu.Item 
                                                    value='empty' 
                                                    disabled
                                                    color='text.tertiary'
                                                >
                                                    Нет сохраненных фильтров
                                                </Menu.Item>
                                            ) : (
                                                Object.entries(savedFilters).map(([name, _filters]) => (
                                                    <Menu.Item 
                                                        key={name} 
                                                        value={name} 
                                                        onClick={() => handleLoadFilterSet(name)}
                                                        color='text.primary'
                                                        _hover={{bg: 'background.tertiary'}}
                                                    >
                                                        <Flex justify='space-between' align='center' width='100%'>
                                                            <Text color='text.primary'>{name}</Text>
                                                            <Button
                                                                size='xs'
                                                                variant='ghost'
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    deleteFilterSet(name);
                                                                }}
                                                                color='text.secondary'
                                                                _hover={{color: 'text.primary', bg: 'background.secondary'}}
                                                            >
                                                                ✕
                                                            </Button>
                                                        </Flex>
                                                    </Menu.Item>
                                                ))
                                            )}
                                        </Menu.Content>
                                    </Menu.Positioner>
                                </Portal>
                            </Menu.Root>
                            <Button
                                variant='outline'
                                onClick={() => setSaveDialogOpen(true)}
                                size='sm'
                                borderColor={borderColor}
                                color='text.primary'
                                _hover={{bg: 'background.tertiary'}}
                            >
                                Сохранить фильтры
                            </Button>
                        </HStack>
                    </Flex>

                    <Stack gap={5}>
                        {/* Основные фильтры в колонку */}
                        <Flex
                            direction={{base: 'column', lg: 'row'}}
                            gap={5}
                            align={{base: 'stretch', lg: 'flex-end'}}
                        >
                            {/* Поиск по названию - теперь первый */}
                            <Box flex={{base: '1', lg: '1'}}>
                                <Text fontWeight='bold' mb={3} color='text.primary' fontSize='md'>
                                    Поиск по названию
                                </Text>
                                <Grid
                                    templateColumns={{base: '1fr', md: '1fr auto'}}
                                    templateRows={{base: 'auto auto', md: 'auto'}}
                                    gap={3}
                                    alignItems='center'
                                >
                                    <Input
                                        ref={searchInputRef}
                                        placeholder='Введите название объявления...'
                                        value={adsStore.filters.search || ''}
                                        onChange={handleSearchChange}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
                                        onFocus={onSearchFocus}
                                        onBlur={onSearchBlur}
                                        height='44px'
                                        borderRadius='8px'
                                        borderColor={borderColor}
                                        bg={inputBg}
                                        color={inputColor}
                                        _placeholder={{color: placeholderColor}}
                                        _focus={{
                                            borderColor: 'border.focused',
                                            boxShadow: '0 0 0 1px {colors.border.focused}',
                                        }}
                                    />
                                    <Button
                                        bg='secondary.default'
                                        color='text.inverse'
                                        _hover={{bg: 'secondary.hover'}}
                                        onClick={handleSearchSubmit}
                                        height='44px'
                                        borderRadius='8px'
                                        fontWeight='semibold'
                                    >
                                        Найти
                                    </Button>
                                </Grid>
                            </Box>

                            {/* Категория */}
                            <Box flex={{base: '1', lg: '0 0 280px'}}>
                                <Text fontWeight='bold' mb={3} color='text.primary' fontSize='md'>
                                    Категория
                                </Text>
                                <Select.Root
                                    collection={categories}
                                    onValueChange={handleCategoryChange}
                                    value={selectedCategory}
                                    size='md'
                                >
                                    <Select.HiddenSelect />
                                    <Select.Control>
                                        <Select.Trigger
                                            style={{
                                                backgroundColor: isDark ? 'var(--chakra-colors-background-tertiary)' : 'var(--chakra-colors-background-primary)',
                                                outline: `2px solid var(--chakra-colors-${borderColor})`,
                                                border: 'none',
                                                borderRadius: '8px',
                                                padding: '10px 12px',
                                                height: '44px',
                                                color: isDark ? 'var(--chakra-colors-text-primary)' : 'var(--chakra-colors-text-primary)',
                                            }}
                                        >
                                            <Select.ValueText placeholder='Все категории' />
                                        </Select.Trigger>
                                        <Select.IndicatorGroup>
                                            <Select.Indicator />
                                        </Select.IndicatorGroup>
                                    </Select.Control>
                                    <Portal>
                                        <Select.Positioner>
                                            <Select.Content
                                                style={{
                                                    borderRadius: '8px',
                                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                                    border: `1px solid var(--chakra-colors-${borderColor})`,
                                                    backgroundColor: isDark ? 'var(--chakra-colors-background-primary)' : 'var(--chakra-colors-background-primary)',
                                                }}
                                            >
                                                {categories.items.map((category) => (
                                                    <Select.Item 
                                                        item={category} 
                                                        key={category.value}
                                                        style={{
                                                            padding: '8px 12px',
                                                            color: isDark ? 'var(--chakra-colors-text-primary)' : 'var(--chakra-colors-text-primary)',
                                                        }}
                                                        _hover={{
                                                            backgroundColor: 'var(--chakra-colors-background-tertiary)',
                                                        }}
                                                    >
                                                        {category.label}
                                                        <Select.ItemIndicator />
                                                    </Select.Item>
                                                ))}
                                            </Select.Content>
                                        </Select.Positioner>
                                    </Portal>
                                </Select.Root>
                            </Box>
                        </Flex>

                        {/* Цена и статус в одной строке на десктопе */}
                        <Flex
                            direction={{base: 'column', lg: 'row'}}
                            gap={5}
                            align={{base: 'stretch', lg: 'flex-start'}}
                        >
                            {/* Диапазон цен */}
                            <Box flex={{base: '1', lg: '1'}}>
                                <Text fontWeight='bold' mb={3} color='text.primary' fontSize='md'>
                                    Диапазон цен
                                </Text>
                                <Flex
                                    direction={{base: 'column', sm: 'row'}}
                                    gap={3}
                                    align={{base: 'stretch', sm: 'center'}}
                                    flexWrap='wrap'
                                >
                                    <HStack
                                        gap={3}
                                        flex='1'
                                        minW={{base: '100%', sm: 'min-content'}}
                                    >
                                        <Input
                                            placeholder='От'
                                            type='number'
                                            value={adsStore.filters.minPrice || ''}
                                            onChange={handlePriceMinChange}
                                            flex='1'
                                            height='44px'
                                            borderRadius='8px'
                                            borderColor={borderColor}
                                            bg={inputBg}
                                            color={inputColor}
                                            _placeholder={{color: placeholderColor}}
                                        />
                                        <Text color='text.tertiary' flex='0 0 auto' fontSize='lg' fontWeight='bold'>
                                            –
                                        </Text>
                                        <Input
                                            placeholder='До'
                                            type='number'
                                            value={adsStore.filters.maxPrice || ''}
                                            onChange={handlePriceMaxChange}
                                            flex='1'
                                            height='44px'
                                            borderRadius='8px'
                                            borderColor={borderColor}
                                            bg={inputBg}
                                            color={inputColor}
                                            _placeholder={{color: placeholderColor}}
                                        />
                                    </HStack>
                                    <Button
                                        onClick={handlePriceApply}
                                        bg='primary.default'
                                        color='text.inverse'
                                        _hover={{bg: 'primary.hover'}}
                                        height='44px'
                                        size='md'
                                        minW='100px'
                                        flex={{base: '1 1 100%', sm: '0 0 auto'}}
                                        borderRadius='8px'
                                        fontWeight='semibold'
                                    >
                                        Применить
                                    </Button>
                                </Flex>
                            </Box>

                            {/* Статус модерации */}
                            <Box flex={{base: '1', lg: '1'}}>
                                <Text fontWeight='bold' mb={3} color='text.primary' fontSize='md'>
                                    Статус модерации
                                </Text>
                                <Stack direction={{base: 'column', md: 'row'}} gap={3} flexWrap='wrap'>
                                    <Checkbox.Root
                                        checked={adsStore.filters.status.includes('pending')}
                                        onCheckedChange={(details) =>
                                            handleStatusFilterChange('pending', details.checked)
                                        }
                                    >
                                        <Checkbox.HiddenInput />
                                        <Checkbox.Control colorPalette='blue' />
                                        <Checkbox.Label 
                                            fontWeight='medium'
                                            color='text.primary'
                                        >
                                            На модерации
                                        </Checkbox.Label>
                                    </Checkbox.Root>

                                    <Checkbox.Root
                                        checked={adsStore.filters.status.includes('approved')}
                                        onCheckedChange={(details) =>
                                            handleStatusFilterChange('approved', details.checked)
                                        }
                                    >
                                        <Checkbox.HiddenInput />
                                        <Checkbox.Control colorPalette='green' />
                                        <Checkbox.Label 
                                            fontWeight='medium'
                                            color='text.primary'
                                        >
                                            Одобрено
                                        </Checkbox.Label>
                                    </Checkbox.Root>

                                    <Checkbox.Root
                                        checked={adsStore.filters.status.includes('rejected')}
                                        onCheckedChange={(details) =>
                                            handleStatusFilterChange('rejected', details.checked)
                                        }
                                    >
                                        <Checkbox.HiddenInput />
                                        <Checkbox.Control colorPalette='red' />
                                        <Checkbox.Label 
                                            fontWeight='medium'
                                            color='text.primary'
                                        >
                                            Отклонено
                                        </Checkbox.Label>
                                    </Checkbox.Root>

                                    <Checkbox.Root
                                        checked={adsStore.filters.status.includes('draft')}
                                        onCheckedChange={(details) =>
                                            handleStatusFilterChange('draft', details.checked)
                                        }
                                    >
                                        <Checkbox.HiddenInput />
                                        <Checkbox.Control colorPalette='orange' />
                                        <Checkbox.Label 
                                            fontWeight='medium'
                                            color='text.primary'
                                        >
                                            На доработке
                                        </Checkbox.Label>
                                    </Checkbox.Root>
                                </Stack>
                            </Box>
                        </Flex>
                    </Stack>
                </Stack>
            </Box>
        );
    });