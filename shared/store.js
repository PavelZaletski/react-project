import {applyMiddleware, createStore} from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';
import reducer from './reducers';

const middleware = applyMiddleware(promise(), thunk, logger());

let store;

export function createNewStore (state) {
    store = createStore(reducer, state, middleware);
    return store;
}

export function getStore() {
    return store;
}
