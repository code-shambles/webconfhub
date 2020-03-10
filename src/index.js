import React from 'react';
import { render } from 'react-dom';

import configureStore from './redux/store';
import { Provider } from 'react-redux';
import { initConfig } from './redux/actions';

import { HashRouter as Router } from 'react-router-dom';
import MainRoute from './routes/MainRoute.jsx';

import './index.less';

const store = configureStore();
store.dispatch(initConfig());

const rootElement = document.getElementById('app');

render(
  <Provider store={store}>
    <Router>
      <MainRoute />
    </Router>
  </Provider>,
  rootElement
);