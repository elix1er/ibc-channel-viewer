import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import IBCInfoFetcher from './components/dapp/IBCInfoFetcher';
import { store } from './features/store';

import './index.css';

import { AppShell } from './components/app-shell';
import { CodeViewer } from './components/dapp/CodeViewer';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <AppShell secondaryChild={<CodeViewer />}>
        <IBCInfoFetcher />
      </AppShell>
    </Provider>
  </React.StrictMode>,
);
