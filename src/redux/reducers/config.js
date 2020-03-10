import * as types from '../actionTypes';

const configReducer = (state = {}, action) => {
  switch (action.type) {
    case types.CONFIG_INIT_SUCCESS: {
      return {
        ...state,
        ...action.payload,
      };
    }
    default:
      return state;
  }
};

export default configReducer;
