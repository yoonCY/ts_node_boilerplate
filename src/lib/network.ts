import * as request from 'request-promise';
import urlConfig from 'src/lib/url';
import { json } from 'body-parser';
import { ObjectIterateeCustom } from 'lodash';

interface Idoption {
    method: string,
    json: boolean,
    headers: object,
    url: string,
    form?: object

}

interface Iparams {
    data?: object,
    url?: string,
    promise?: boolean,
    callback?: Function,
    error?: Function,
    debug ?: boolean
}

interface Icallback {
    result: boolean,
    data: object,
    description: string
}

const default_options: Idoption = {
    method: 'POST',
    json: true,
    url: "",
    headers: {
        //"User-Agent": "ifamily_biz/0.0.1",
        "Connection": "keep-alive",
        // 'Content-Type': 'application/x-www-form-urlencoded'
        'content-type': 'application/json'
    } //x-www-form-urlencoded
}

let default_error_params = {
    result: false,
    data: {},
    description: "네트워크연결이 실패 하였습니다."
}

const options = (param: Iparams = {}): Idoption => {
    let option = default_options;

    if (param.data) option.form = param.data;
    option.url = urlConfig(param.url)

    if (!option.url) return;

    return option;
};

function default_error_callback(err: any = {}, params: Iparams = {}) {

    if (err.statusCode) {
        switch (err.statusCode) {
            case 404:
            case 500:
                params.callback(default_error_params);
                break;
            default:
                params.callback(default_error_params);
                break;
        }
    }
}

export default async (params: Iparams = {}) => {

    const networkOption = options(params);
    let networkParam = null;

    try {
        networkParam = await request(networkOption);
        if( params.debug === true ){
            console.log("networkParam : ", networkParam)
        }
    } catch (error) {

        if( params.debug === true ){
            console.log("networkParamERR : ", error)
        }

        if (params.error) {
            params.error(error, params);
        } else {

            if (params.promise === true) {
                return null;
            } else {
                default_error_callback(error, params);
            }

        }

        return;
    }

    if (params.callback) {
        params.callback(networkParam)
    }

    if (params.promise === true) {
        return networkParam ? networkParam : {} ;
    }

}
