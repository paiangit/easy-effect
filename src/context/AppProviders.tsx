import React, { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import '~styles/global.less';
import '~styles/iconfont.less';

function AppProviders({ children }: { children: ReactNode }) {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  );
};

export default AppProviders;
