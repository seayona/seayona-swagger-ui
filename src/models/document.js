import { load } from '../services/document';


export default {

    namespace: 'document',

    state: {
        data: null,
    },

    subscriptions: {
        setup({ dispatch, history }) {  // eslint-disable-line
        },
    },

    effects: {
        *loadData({ payload }, { call, put }) {  // eslint-disable-line
            const data = yield call(load, { url: 'http://localhost:8080/v2/api-docs' });
            yield put({ type: 'save', payload: { data } });
        },
    },

    reducers: {
        save(state, action) {
            return { ...state, ...action.payload };
        },
    },

};
