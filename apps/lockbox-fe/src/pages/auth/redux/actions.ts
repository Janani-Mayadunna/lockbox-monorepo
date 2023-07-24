import {
  GET_CURRENT_USER,
  GET_CURRENT_USER_FAILURE,
  GET_CURRENT_USER_SUCCESS,
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT_FAILURE,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
} from './actionTypes';
import {
  GetCurrentuser,
  GetCurrentuserFailure,
  GetCurrentuserSuccess,
  LoginFailure,
  LoginFailurePayload,
  LoginPayload,
  LoginRequest,
  LoginSuccess,
  LoginSuccessPayload,
  LogoutFailure,
  LogoutRequest,
  LogoutSuccess,
} from './types';

export const loginRequest = (payload: LoginPayload): LoginRequest => ({
  type: LOGIN_REQUEST,
  payload,
});

export const loginSuccess = (payload: LoginSuccessPayload): LoginSuccess => ({
  type: LOGIN_SUCCESS,
  payload,
});

export const loginFailure = (payload: LoginFailurePayload): LoginFailure => ({
  type: LOGIN_FAILURE,
  payload,
});

export const getCurrentUser = (): GetCurrentuser => ({
  type: GET_CURRENT_USER,
  payload: {},
});

export const getCurrentUserSuccess = (): GetCurrentuserSuccess => ({
  type: GET_CURRENT_USER_SUCCESS,
});

export const getCurrentUserFailure = (error: any): GetCurrentuserFailure => ({
  type: GET_CURRENT_USER_FAILURE,
  payload: error,
});

export const logoutRequest = (): LogoutRequest => ({
  type: LOGOUT_REQUEST,
  payload: {},
});

export const logoutSuccess = (): LogoutSuccess => ({
  type: LOGOUT_SUCCESS,
  payload: {},
});

export const logoutFailure = (error: any): LogoutFailure => ({
  type: LOGOUT_FAILURE,
  payload: { error },
});
