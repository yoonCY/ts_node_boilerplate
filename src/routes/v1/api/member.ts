import * as express from 'express';

import loginProc from 'src/moduls/process/login'
import chatProc from 'src/moduls/process/chat'

import {
    returnData,
    wrap,
    date
} from 'src/lib/reshelper'

interface Ilogin_param {
    user_id: string,
    user_pw?: string
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

    router.post('/login', wrap(async (req: express.Request, res: express.Response, next: express.NextFunction) => {

        const params: Ilogin_param = req.body;

        let return_data = await loginModel.login(params);;
        console.log(date(null))
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

    router.post('/my_room_list', wrap(async (req: express.Request, res: express.Response, next: express.NextFunction) => {

        const params: any = req.body;

        let return_data : any = returnData(false) ;

        switch (params.search_type) {
            case "row":
                return_data = await chatModel.Search_myRoomRow(params);
                break;
            case "list":
                return_data = await chatModel.Search_myRoomList(params);
                break;
        }

        res.json(return_data);
    }));

    return router;
}
