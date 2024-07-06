import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import './index.css';

import { store } from './app/store';
import IBCInfoFetcher from './components/dapp/IBCInfoFetcher';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <IBCInfoFetcher />
    </Provider>
  </React.StrictMode>,
);
