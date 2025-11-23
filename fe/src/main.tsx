import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';

import {ThemeProvider} from '@/shared/components/Navigation/context.tsx';

import App from './entry/App.tsx';

createRoot(document.getElementById('root')!).render(
    <ThemeProvider>
        <StrictMode>
            <App />
        </StrictMode>
    </ThemeProvider>,
);
