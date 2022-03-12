import React, { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from '../components/ErrorFallback';
import '~styles/global.less';
import '~styles/iconfont.less';
import 'antd/dist/antd.less';

function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default AppProviders;
