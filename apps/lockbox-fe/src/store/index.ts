import { legacy_createStore as createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import logger from "redux-logger";

import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { rootSaga } from "../root-saga";
import rootReducer from "../root-reducer";

const sagaMiddleware = createSagaMiddleware();

const store = createStore(rootReducer, applyMiddleware(sagaMiddleware, logger));

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;

export type AddDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AddDispatch>();

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
