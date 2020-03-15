import { combineReducers } from 'redux';

import app from './app';
import config from './config';
import invitations from './invitations';

export default combineReducers({ app, config, invitations });
