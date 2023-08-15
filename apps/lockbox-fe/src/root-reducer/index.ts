import { combineReducers } from 'redux';
import authReducer from '../pages/auth/redux/reducer';
import vaultReducer from '../pages/dashboard/redux/reducer';

// combine multiple reducers into a single reducer function
const rootReducer = combineReducers({
  auth: authReducer,
  vaults: vaultReducer,
});

// exports a TypeScript type AuthState which is defined as the return type of the authReducer function.
export type AuthState = ReturnType<typeof authReducer>;

export default rootReducer;
