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
  SIGNUP_FAILURE,
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
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
  SignupFailure,
  SignupRequest,
  SignupRequestPayload,
  SignupSuccess,
  SignupSuccessPayload,
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

export const signupRequest = (
  payload: SignupRequestPayload,
): SignupRequest => ({
  type: SIGNUP_REQUEST,
  payload,
});

export const signupSuccess = (payload: SignupSuccessPayload): SignupSuccess => ({
  type: SIGNUP_SUCCESS,
  payload,
});

export const signupFailure = (payload: any): SignupFailure => ({
  type: SIGNUP_FAILURE,
  payload,
});
