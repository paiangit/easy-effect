import { render, screen } from '@testing-library/react';
import { ReactNode } from 'react';
import AppProviders from '../../../context/AppProviders';
import MainPage from '../MainPage';

const renderPage = (ui: ReactNode, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test Page', route);

  return render(
    <AppProviders>
      {ui}
    </AppProviders>
  );
}

test('Logo展示', async () => {
  renderPage(<MainPage/>, { route: '/' });
  expect(screen.getByText('Lottie Editor')).toBeInTheDocument();
});

test('简介展示', async () => {
  renderPage(<MainPage/>, { route: '/' });
  expect(screen.getByText('快速制作精美动效')).toBeInTheDocument();
});

test('slogan展示', async () => {
  renderPage(<MainPage/>, { route: '/' });
  expect(screen.getByText('通过精美的动效模版和可视化编辑界面，让你轻松获得满意的动效～')).toBeInTheDocument();
});

test('立即使用按钮展示', async () => {
  renderPage(<MainPage/>, { route: '/' });
  expect(screen.getByText('立即使用')).toBeInTheDocument();
});
