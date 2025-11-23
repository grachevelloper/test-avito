import {createSystem, defaultConfig, defineConfig} from '@chakra-ui/react';

const config = defineConfig({
    theme: {
        tokens: {
            colors: {
                avito: {
                    blue: {
                        50: {value: '#e6f7ff'},
                        100: {value: '#b3e0ff'},
                        200: {value: '#80c9ff'},
                        300: {value: '#4db2ff'},
                        400: {value: '#1a9bff'},
                        500: {value: '#0084ff'},
                        600: {value: '#0066cc'},
                        700: {value: '#004d99'},
                        800: {value: '#003366'},
                        900: {value: '#001a33'},
                    },
                    orange: {
                        50: {value: '#fff5e6'},
                        100: {value: '#ffe0b3'},
                        200: {value: '#ffcc80'},
                        300: {value: '#ffb74d'},
                        400: {value: '#ffa31a'},
                        500: {value: '#ff8f00'},
                        600: {value: '#cc7200'},
                        700: {value: '#995500'},
                        800: {value: '#663800'},
                        900: {value: '#331c00'},
                    },
                    gray: {
                        50: {value: '#f8f9fa'},
                        100: {value: '#f1f3f4'},
                        200: {value: '#e8eaed'},
                        300: {value: '#dadce0'},
                        400: {value: '#bdc1c6'},
                        500: {value: '#9aa0a6'},
                        600: {value: '#80868b'},
                        700: {value: '#5f6368'},
                        800: {value: '#3c4043'},
                        900: {value: '#202124'},
                    },
                },
            },
        },
        semanticTokens: {
            colors: {
                primary: {
                    DEFAULT: {value: '{colors.avito.blue.500}'},
                    hover: {value: '{colors.avito.blue.600}'},
                    pressed: {value: '{colors.avito.blue.700}'},
                },
                secondary: {
                    DEFAULT: {value: '{colors.avito.orange.500}'},
                    hover: {value: '{colors.avito.orange.600}'},
                    pressed: {value: '{colors.avito.orange.700}'},
                },
                background: {
                    primary: {value: {base: '{colors.white}', _dark: '{colors.avito.gray.900}'}}, // ИСПРАВЛЕНО: был gray.50, стал gray.900
                    secondary: {value: {base: '{colors.avito.gray.50}', _dark: '{colors.avito.gray.800}'}}, // ИСПРАВЛЕНО
                    tertiary: {value: {base: '{colors.avito.gray.100}', _dark: '{colors.avito.gray.700}'}}, // ИСПРАВЛЕНО
                },
                text: {
                    primary: {value: {base: '{colors.avito.gray.900}', _dark: '{colors.white}'}}, // ИСПРАВЛЕНО: для темной темы белый текст
                    secondary: {value: {base: '{colors.avito.gray.700}', _dark: '{colors.avito.gray.200}'}}, // ИСПРАВЛЕНО
                    tertiary: {value: {base: '{colors.avito.gray.500}', _dark: '{colors.avito.gray.400}'}}, // ИСПРАВЛЕНО
                    inverse: {value: {base: '{colors.white}', _dark: '{colors.avito.gray.900}'}}, // ИСПРАВЛЕНО
                },
                border: {
                    DEFAULT: {value: {base: '{colors.avito.gray.300}', _dark: '{colors.avito.gray.600}'}}, // ИСПРАВЛЕНО
                    strong: {value: {base: '{colors.avito.gray.400}', _dark: '{colors.avito.gray.500}'}}, // ИСПРАВЛЕНО
                    focused: {value: {base: '{colors.avito.blue.500}', _dark: '{colors.avito.blue.400}'}},
                },
                status: {
                    success: {value: '#34a853'},
                    warning: {value: '#f9ab00'},
                    error: {value: '#ea4335'},
                    info: {value: {base: '{colors.avito.blue.500}', _dark: '{colors.avito.blue.400}'}},
                },
            },
        },
    },
});

export const theme = createSystem(defaultConfig, config);