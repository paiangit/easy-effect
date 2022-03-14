import React, { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from '../components/ErrorFallback';
// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import '~styles/global.less';
import '~styles/iconfont.less';
import 'antd/dist/antd.less';

function AppProviders({ children }: { children: ReactNode }) {
  dayjs.locale('zh-cn');

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <BrowserRouter>{children}</BrowserRouter>
    </ErrorBoundary>
  );
}

export default AppProviders;
