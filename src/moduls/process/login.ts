import { office, redis } from 'src/db'
import { returnData, date } from 'src/lib/reshelper'

type Isearch_user_query = {
    user_id: string,
    user_pw?: string,
}

export default class {

    // 유저 확인
    async search_user(params: any) {

        let return_data;

        let query: Isearch_user_query = {
            user_id : params.user_id
        }
        
        let search_user_info = await office.user.findOne(query);

        if (!search_user_info) {
            return returnData(false, null, "아이디가 존재하지 않습니다.");
        }

        return returnData(true, search_user_info, "확인");
    }

    // 로그인
    async login(params: any) {

        let return_data;

        let query: Isearch_user_query = {
            user_id : params.user_id
        }

        if (params.user_id === undefined && params.user_pw === undefined) {

            return returnData(false, null, "입력 정보 오류 입니다.");

        }

        let search_user_info = await office.user.findOne(query);

        if (!search_user_info) {
            return returnData(false, null, "아이디가 존재하지 않습니다.");
        }

        if ( search_user_info.user_pw !== params.user_pw  ) {
            return returnData(false, null, "비밀번호가 일치하지 않습니다.");
        }

        return returnData(true, search_user_info, "로그인 성공");
    }
    

    // 로그아웃
    async logout(params: any) {

        let return_data;

        let query: Isearch_user_query = {
            user_id : params.user_id
        }

        let search_user_info = await office.user.findOne(query);

        if (!search_user_info) {
            return returnData(false, null, "아이디가 존재하지 않습니다.");
        }

        if ( search_user_info.user_pw !== params.user_pw  ) {
            return returnData(false, null, "비밀번호가 일치하지 않습니다.");
        }

        return returnData(true, search_user_info, "로그인 성공");
    }

    // 사용자 가입 
    async regist(params: any) {

        
        let return_data;

        let saveQuery: Isearch_user_query = {
            user_id : params.user_id,
            user_pw : params.user_pw
        }

        const saveModel = new office.user(saveQuery);

        if (params.user_id === undefined && params.user_pw === undefined) {
            return returnData(false, null, "입력 정보 오류 입니다.");
        }

        let search_user_info = await office.user.findOne({
            user_id : params.user_id
        });

        if ( search_user_info ) {
            return returnData(false, null, "이미 가입되었습니다.");
        }
        
        saveModel.save();

        return returnData(true, null, "저장완료");
    }

}