import { AuthState } from '../../../root-reducer';
import { createSelector } from 'reselect';

const getPending = (state: AuthState) => state.pending;
const getError = (state: AuthState) => state.error;
const getToken = (state: AuthState) => state.token;

export const getAuthSelector = createSelector(getToken, (token) => token);

export const getPendingSelector = createSelector(
  getPending,
  (pending) => pending,
);

export const getErrorSelector = createSelector(getError, (error) => error);
