import React from 'react';
import { render } from 'react-dom';

import configureStore from './redux/store';
import { Provider } from 'react-redux';
import { initConfig, initInvitations } from './redux/actions';

import { HashRouter as Router } from 'react-router-dom';
import MainRoute from './routes/MainRoute.jsx';

import { AdBar, Setup } from './components';

import './index.less';

const store = configureStore();
store.dispatch(initConfig());
store.dispatch(initInvitations());

const rootElement = document.getElementById('app');

render(
  <Provider store={store}>
    <Setup />
    <Router>
      <MainRoute />
      <AdBar />
    </Router>
  </Provider>,
  rootElement
);
