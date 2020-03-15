import * as types from '../actionTypes';

const invitationsReducer = (state = {}, action) => {
  switch (action.type) {
    case types.INIT_INVITATIONS_FINISHED: {
      return {
        ...state,
        ...action.payload,
      };
    }
    case types.INIT_REGISTRATIONS_FINISHED: {
      return {
        ...state,
        ...action.payload,
      };
    }
    case types.REGISTRATION_SETTLED: {
      return {
        ...state,
        ...action.payload,
      };
    }
    default:
      return state;
  }
};

export default invitationsReducer;
