import request from '@utils/request';

export function load(params) {
    return request(params.url);
}
