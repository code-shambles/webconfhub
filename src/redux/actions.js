import * as types from './actionTypes';
import config from '../config';

export function initConfig() {
  return {
    type: types.CONFIG_INIT_SUCCESS,
    payload: { ...config },
  };
}
