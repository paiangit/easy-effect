import { render, screen } from '@testing-library/react';
import { ReactNode } from 'react';
import AppProviders from '~context/AppProviders';
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
  expect(screen.getByText('动效易')).toBeInTheDocument();
});

test('简介标题展示', async () => {
  renderPage(<MainPage/>, { route: '/' });
  expect(screen.getByText('快速制作精美动效')).toBeInTheDocument();
});

test('立即使用按钮展示', async () => {
  renderPage(<MainPage/>, { route: '/' });
  expect(screen.getByText('立即使用')).toBeInTheDocument();
});
