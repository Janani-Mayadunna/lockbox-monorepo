import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    GET_CURRENT_USER,
    GET_CURRENT_USER_SUCCESS,
    GET_CURRENT_USER_FAILURE,
  } from "./actionTypes";
  
import { AuthAction, AuthState } from "./types";

const initialState: AuthState = {
    pending: false,
    error: null,
    token: "",
    isLoggedIn: false,
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
          // isLoggedIn: true,
        };
      case LOGIN_FAILURE:
        return {
          ...state,
          pending: false,
          token: "",
          error: action.payload.error,
          // isLoggedIn: false,
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
  
      default:
        return { ...state };
    }
  };
  
  export default reducers;
  