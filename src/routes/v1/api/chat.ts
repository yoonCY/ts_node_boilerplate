import * as express from 'express';

import loginProc from 'src/moduls/process/login'
import chatProc from 'src/moduls/process/chat'

import {
    returnData,
    wrap,
    date,
    uniqueArray
} from 'src/lib/reshelper'

interface Ilogin_param {
    user_id : string,
    user_pw ?: string
}

const default_returnData = {
    result: false,
    data: {},
    description: "네트워크 통신 실패입니다.",
}

const loginModel = new loginProc();
const chatModel = new chatProc();

export default () => {

    let router = express.Router();

    router.get('/test', wrap(async (req: express.Request, res: express.Response, next: express.NextFunction) => {

        let params: any = req.body;

        params = {
            user_id : "kin123s",
            room_list : uniqueArray( ["kin123d", "kin123s" ] ), 
            last_contents : "",
            message_time : date().ymdhis
        }

        params.room_list.sort();

        let return_data = await loginModel.search_user({
            user_id : params.user_id
        });

        if( return_data.result === true ){
            return_data = await chatModel.create_room( params );
        }

        res.json(return_data);
    }));

    router.post('/logout', wrap(async (req: express.Request, res: express.Response, next: express.NextFunction) => {

        const params: Ilogin_param = req.body;

        let return_data = await loginModel.logout(params);;

        res.json(return_data);
    }));
    
    router.post('/regist', wrap(async (req: express.Request, res: express.Response, next: express.NextFunction) => {

        const params: Ilogin_param = req.body;

        let return_data = await loginModel.regist(params);;

        res.json(return_data);
    }));

    return router;
}
