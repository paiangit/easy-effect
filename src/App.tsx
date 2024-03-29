import { lazy, Suspense } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import FullPageLoading from './components/FullPageLoading';

const NotFoundPage = lazy(() => import('./features/exceptions/NotFoundPage'));
const MainLayout = lazy(() => import('./features/home/MainLayout'));
const MainPage = lazy(() => import('./features/home/MainPage'));
const EditorPage = lazy(() => import('./features/editor/EditorPage'));

function App() {
  const routes = {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <MainPage />,
      },
      {
        path: '404',
        element: <NotFoundPage />,
      },
      {
        path: 'editor',
        element: <EditorPage />,
      },
      {
        path: '*',
        element: <Navigate to="/404" />,
      },
    ],
  };
  const routing = useRoutes([routes]);

  return <Suspense fallback={<FullPageLoading />}>{routing}</Suspense>;
}

export default App;
