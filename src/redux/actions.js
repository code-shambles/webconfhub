import * as types from './actionTypes';
import branding from '../config/branding';
import mainMenu from '../config/mainMenu';
import rooms from '../config/rooms';
import sponsors from '../config/sponsors';

export function initConfig() {
  return {
    type: types.CONFIG_INIT_SUCCESS,
    payload: {
      branding: { ...branding },
      rooms: [...rooms],
      mainMenu: { ...mainMenu },
      sponsors: [...sponsors],
    },
  };
}
