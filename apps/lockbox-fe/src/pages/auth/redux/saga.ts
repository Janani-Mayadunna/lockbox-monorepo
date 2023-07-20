import { all, call, put, takeLatest } from 'redux-saga/effects';
import API from '../constants';
import { LOGIN_REQUEST } from './actionTypes';
import { loginFailure, loginSuccess } from './actions';
import { LoginPayload } from './types';
import { push } from 'connected-react-router';

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
      console.log(token);
      
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

    yield put(push('/'));
  } catch (e: any) {
    yield put(loginFailure({ error: e.message }));
  }
}

export function* authSaga() {
  yield all([takeLatest(LOGIN_REQUEST, loginSaga)]);
}
