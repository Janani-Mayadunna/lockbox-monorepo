import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  GET_CURRENT_USER,
  GET_CURRENT_USER_SUCCESS,
  GET_CURRENT_USER_FAILURE,
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,
} from './actionTypes';

import { AuthAction, AuthState } from './types';

const initialState: AuthState = {
  pending: false,
  error: null,
  token: {
    access_token: '',
    userId: '',
  },
  isLoggedIn: false,
  message: null,
};

const reducers = (state = initialState, action: AuthAction) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        pending: false,
        token: action.payload.token,
        error: null,
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        pending: false,
        error: action.payload.error,
      };
    case GET_CURRENT_USER:
      return {
        ...state,
        loading: true,
      };
    case GET_CURRENT_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        // currentUser: action.payload,
      };
    case GET_CURRENT_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case SIGNUP_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case SIGNUP_SUCCESS:
      return {
        ...state,
        message: action.payload.message,
        pending: false,
        error: null,
      };
    case SIGNUP_FAILURE:
      return {
        ...state,
        pending: false,
        error: action.payload.error,
      };
    default:
      return { ...state };
  }
};

export default reducers;
