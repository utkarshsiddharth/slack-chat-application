import * as actionTypes from './types';

export const setUser = (user) => {
  return {
    type: actionTypes.SET_USER,
    payload: {
      currentUser: user,
    },
  };
};

export const clearUser = () => {
  return {
    type: actionTypes.CLEAR_USER,
    payload: {},
  };
};

export const setCurrentChannel = (channle) => {
  return {
    type: actionTypes.SET_CURRENT_CHANNEL,
    payload: channle,
  };
};
