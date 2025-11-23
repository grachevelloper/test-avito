import {ChakraProvider, Box, Theme} from '@chakra-ui/react';
import {AnimatePresence} from 'framer-motion';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    useLocation,
} from 'react-router-dom';

import {useThemeContext} from '@/shared/components/Navigation/context';
import {Navigation} from '@/shared/components/Navigation/Navigation';
import {PageTransition} from '@/shared/components/PageTransition';
import {theme} from '@/shared/config/theme';

import {AdsDetailsPage} from '../pages/AdsDetails/AdsDetails';
import {AdsListPage} from '../pages/AdsList/AdsList';
import {StatsPage} from '../pages/Stats/Stats';

import './index.scss';

const routes = [
    {path: '/', element: <Navigate to='/list' replace />},
    {path: '/list', element: <AdsListPage />},
    {path: '/item/:id', element: <AdsDetailsPage />},
    {path: '/stats', element: <StatsPage />},
];

function AnimatedRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence mode='wait'>
            <Routes location={location} key={location.pathname}>
                {routes.map((route) => (
                    <Route
                        key={route.path}
                        path={route.path}
                        element={
                            <PageTransition>
                                {route.element}
                            </PageTransition>
                        }
                    />
                ))}
            </Routes>
        </AnimatePresence>
    );
}

function App() {
    const {resolvedTheme} = useThemeContext();
    return (
        <ChakraProvider value={theme}>
            <Theme appearance={resolvedTheme}>
                <Router>
                    <Box minH='100vh' width='100%' bg='background.primary'>
                        <Navigation />
                        <AnimatedRoutes />
                    </Box>
                </Router>
            </Theme>
        </ChakraProvider>
    );
}

export default App;