import { load } from '@services/document';


export default {

    namespace: 'document',

    state: {
        data: null,
        info: null,
        links: [],
        tags: [],
        menus: []
    },

    subscriptions: {
        setup({ dispatch, history }) {  // eslint-disable-line
        },
    },

    effects: {
        *loadData({ payload }, { call, put }) {  // eslint-disable-line

            const document = yield call(load, { url: 'http://localhost:8080/swagger.json' });
            let data, paths, info, tags = [], menus = [], links = [];

            if (document && document.data) {
                data = document.data;
                info = document.data.info;

                if(document.data.info){
                    links = document.data.info['x-links'] || [];
                }

                paths = data.paths || [];
                tags = data.tags || [];
            }
            for (let route in paths) {
                for (let method in paths[route]) {
                    const detail = paths[route][method];
                    detail.tags && detail.tags.map(tag => {
                        if (tags.find(t => t.name == tag) == null) {
                            tags.push({ name: tag });
                        }
                        menus.push({
                            id: route.substring(1).replace(/\//g, '-').replace(/\{/g, '').replace(/\}/g, '') + '-' + method,
                            tag: tag,
                            name: detail.summary || route,
                            description: detail.description,
                            path: route,
                            method: method,
                            detail: paths[route][method]
                        });
                    })
                }
            }
            yield put({ type: 'save', payload: { data, info, tags, menus, links } });
        },
    },

    reducers: {
        save(state, action) {
            return { ...state, ...action.payload };
        },
    },

};
