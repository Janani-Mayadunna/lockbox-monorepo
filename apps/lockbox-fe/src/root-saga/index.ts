import { all, fork } from 'redux-saga/effects';
import authSaga from '../pages/auth/redux/saga';
import vaultSaga from '../pages/dashboard/redux/saga';

export function* rootSaga() {
  //authSaga is responsible for the side effects relevant to the auth reducer

  yield all([fork(authSaga)]);
  yield all([fork(vaultSaga)]);
}
