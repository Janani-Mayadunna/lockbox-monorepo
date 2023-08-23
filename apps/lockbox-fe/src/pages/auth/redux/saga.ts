import { all, call, put, takeLatest } from 'redux-saga/effects';
import API from '../constants';
import { LOGIN_REQUEST, LOGOUT_REQUEST, SIGNUP_REQUEST } from './actionTypes';
import {
  loginFailure,
  loginSuccess,
  logoutFailure,
  logoutSuccess,
  signupFailure,
  signupSuccess,
} from './actions';
import {
  LoginPayload,
  LoginSuccessPayload,
  SignupRequest,
  SignupRequestPayload,
  SignupSuccessPayload,
} from './types';

const login = async (payload: LoginPayload) => {
  try {
    const response = await fetch(`${API.LOGIN.path}`, {
      method: `${API.LOGIN.method}`,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: payload.values.email,
        password: payload.values.password,
      }),
    });

    if (response.status === 201) {
      const token = await response.json();

      sessionStorage.setItem('jwt-lockbox', JSON.stringify(token));
      return {
        token: {
          access_token: token.access_token,
          userId: token.userId,
        },
      };
    } else {
      throw new Error('Login failed');
    }
  } catch (error: any) {
    throw new Error(error);
  }
};

function* loginSaga(action: any) {
  try {
    const response: LoginSuccessPayload = yield call(login, {
      values: action.payload.values,
    });

    yield put(
      loginSuccess({
        token: {
          access_token: response.token.access_token,
          userId: response.token.userId,
        },
      }),
    );
  } catch (error: any) {
    yield put(loginFailure({ error: error.message }));
  }
}

function* logoutSaga() {
  try {
    sessionStorage.removeItem('jwt-lockbox');
    sessionStorage.removeItem('current-user');
    sessionStorage.removeItem('VK');

    yield put(logoutSuccess());
  } catch (error: any) {
    yield put(logoutFailure(error));
  }
}

const signUp = async (payload: SignupRequestPayload) => {
  try {
    const response = await fetch(`${API.SIGNUP.path}`, {
      method: `${API.SIGNUP.method}`,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: payload.name,
        email: payload.email,
        password: payload.password,
        salt: payload.salt,
      }),
    });

    const message = await response.json();
    return message;
  } catch (error: any) {
    throw new Error(error);
  }
};

export function* signUpSaga(action: SignupRequest) {
  try {
    const message: SignupSuccessPayload = yield call(signUp, {
      name: action.payload.name,
      email: action.payload.email,
      password: action.payload.password,
      salt: action.payload.salt,
    });
    if (message.message === 'signup successful') {
      yield put(signupSuccess(message));
    } else {
      yield put(signupFailure({ error: message.message }));
    }
  } catch (error: any) {
    yield put(signupFailure({ error: error.message }));
  }
}

function* authSaga() {
  yield all([takeLatest(LOGIN_REQUEST, loginSaga)]);
  yield all([takeLatest(LOGOUT_REQUEST, logoutSaga)]);
  yield all([takeLatest(SIGNUP_REQUEST, signUpSaga)]);
}

export default authSaga;
