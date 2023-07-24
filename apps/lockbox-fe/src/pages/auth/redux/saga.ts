import { all, call, put, takeLatest } from 'redux-saga/effects';
import API from '../constants';
import { LOGIN_REQUEST, LOGOUT_REQUEST } from './actionTypes';
import {
  loginFailure,
  loginSuccess,
  logoutFailure,
  logoutSuccess,
} from './actions';
import { LoginPayload } from './types';

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

    console.log('Response here', response);

    if (response.status === 201) {
      const token = await response.json();

      localStorage.setItem('jwt-lockbox', JSON.stringify(token));
      localStorage.setItem('isLoggedIn', JSON.stringify(true));

      console.log('Successfully Logged In!');
      return token;
    } else {
      console.log('Failed to Login');
    }
  } catch (error) {
    console.log(error);
  }
};

function* loginSaga(action: any) {
  try {
    const response: { token: string } = yield call(login, {
      values: action.payload.values,
    });

    yield put(loginSuccess({ token: response.token }));
  } catch (e: any) {
    yield put(loginFailure({ error: e.message }));
  }
}

function* logoutSaga() {
  try {
    localStorage.removeItem('jwt-lockbox');
    localStorage.setItem('isLoggedIn', JSON.stringify(false));
    localStorage.removeItem('current-user');
    localStorage.removeItem('VK');

    yield put(logoutSuccess());
  } catch (error) {
    yield put(logoutFailure(error));
  }
}

export function* authSaga() {
  yield all([takeLatest(LOGIN_REQUEST, loginSaga)]);
  yield all([takeLatest(LOGOUT_REQUEST, logoutSaga)]);
}
