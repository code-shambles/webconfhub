import * as types from '../actionTypes';

const appReducer = (state = { loading: true, registered: false }, action) => {
  switch (action.type) {
    case types.INIT_INVITATIONS_FINISHED: {
      return {
        ...state,
        loading: false,
      };
    }
    case types.INIT_REGISTRATIONS_FINISHED: {
      return {
        ...state,
        registered: true,
      };
    }
    default:
      return state;
  }
};

export default appReducer;
