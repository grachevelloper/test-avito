import {ChakraProvider, Box} from '@chakra-ui/react';
import {AnimatePresence} from 'framer-motion';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    useLocation,
} from 'react-router-dom';

import {Navigation} from '@/shared/components/Navigation/Navigation';
import {PageTransition} from '@/shared/components/PageTransition';
import {theme} from '@/shared/config/theme';

import {AdsDetails} from '../pages/AdsDetails/AdsDetails';
import {AdsList} from '../pages/AdsList/AdsList';
import {Stats} from '../pages/Stats/Stats';

import './index.scss';

const routes = [
    {path: '/', element: <Navigate to='/list' replace />},
    {path: '/list', element: <AdsList />},
    {path: '/item/:id', element: <AdsDetails />},
    {path: '/stats', element: <Stats />},
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
    return (
        <ChakraProvider value={theme}>
            <Router>
                <Box minH='100vh' width='100%' bg='background.primary'>
                    <Navigation />
                    <AnimatedRoutes />
                </Box>
            </Router>
        </ChakraProvider>
    );
}

export default App;