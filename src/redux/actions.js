import * as types from './actionTypes';
import baseConfig from '../config/baseConfig';
import branding from '../config/branding';
import mainMenu from '../config/mainMenu';
import rooms from '../config/rooms';
import sponsors from '../config/sponsors';
import {
  handleInvitations,
  handleRegistrations,
  handleSettleRegistration,
} from '../api/invitations';

export function initConfig() {
  return {
    type: types.CONFIG_INIT_SUCCESS,
    payload: {
      baseConfig: { ...baseConfig },
      branding: { ...branding },
      rooms: [...rooms],
      mainMenu: { ...mainMenu },
      sponsors: [...sponsors],
    },
  };
}

export function initInvitations() {
  const invitations = handleInvitations();

  return function(dispatch) {
    dispatch(initInvitationsFinished(invitations));
    dispatch(initRegistrations(invitations));
  };
}

export function initInvitationsFinished(invitations) {
  return {
    type: types.INIT_INVITATIONS_FINISHED,
    payload: { ...invitations },
  };
}

export function initRegistrations(invitations) {
  return function(dispatch) {
    return handleRegistrations(invitations)
      .then(invitations => {
        dispatch(initRegistrationsFinished(invitations));
      })
      .catch(error => {
        throw error;
      });
  };
}

export function initRegistrationsFinished(invitations) {
  return {
    type: types.INIT_REGISTRATIONS_FINISHED,
    payload: { ...invitations },
  };
}

export const settleRegistration = (livewebinarRoomId, invitations) => {
  const updatedInvitations = handleSettleRegistration(
    livewebinarRoomId,
    invitations
  );
  return {
    type: types.REGISTRATION_SETTLED,
    payload: { ...updatedInvitations },
  };
};
