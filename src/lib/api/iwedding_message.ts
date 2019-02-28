
import * as express from 'express'
import network from 'src/lib/network';
import * as types from 'src/lib/type/type_iwedding'

import * as Dtypes from 'src/types/imessage'
import * as Rtypes from 'src/types/imessage_result'

import { imessage } from 'src/db'
import user from 'src/moduls/mongo/office/user';
import { uniqueArray } from 'src/lib/reshelper';

interface Icallback {
    result: boolean,
    data: object,
    description ?: string
}

const default_returnData = {
    result: false,
    data: {},
    description: "네트워크 통신 실패입니다.",
}

export default class {

    async checkUUID( data : Dtypes.uuid )  {

        const result = await network({
            url: "get_user_info",
            data: data,
            promise: true
        });
        
        return result;

    }

    // 방 입장
    async first(data: Dtypes.user_info ) : Promise<Rtypes.join_first> {

        const result = await network({
            url: "get_room_list_simple",
            data: data,
            promise: true
        });

        // return returnCheckHandler(result);
        return result;
    }

    // 방 리스트
    async searchRoomList(data: Dtypes.user_info )  {

        const result = await network({
            url: "get_room_list",
            data: data,
            promise: true
        });
       
        return result;
    }

    // 방 리스트 단건
    async searchRoomRow(data: any ) {

        const result = await network({
            url: "get_room_row",
            data: data,
            promise: true
        });
       
        return result;
    }

    // 방 입장
    async messageList(data: Dtypes.room_default ) {

    
        const result = await network({
            url: "get_message_list",
            data: data,
            promise: true
        });
       
        return result;
    }

    // 방 참여자 정보 불러오기
    async roomUserList(data: Dtypes.room_default ) {

    
        const result = await network({
            url: "get_room_pt_list",
            data: data,
            promise: true
        });
    
        return result;
    }
    

    // 방 알림 메시지
    async InfoMessage(data: Dtypes.room_default ) {

        const result = await network({
            url: "get_info_message",
            data: data,
            promise: true,
            debug : true
        });
    
        return result;
    }

    // 아이웨딩 방 체크 
    async checkIweddingRoom(data: types.IDefaultSocket) {

        const result = await network({
            url: "create_iwedding",
            data: data,
            promise: true
        });
    
        return result;
    }

    // 아이웨딩 방 체크 
    async sendMessage(data: Dtypes.send_message, room_no : Number ) {

        const room_active_list = await imessage.room.find({
            room_no : room_no
        }, {
            user_id : 1
        }).exec();

        let user_list : Array<any> = [];

        await room_active_list.forEach( ( row : any) => {
            user_list.push( row.user_id )
        }); 

        user_list = uniqueArray( user_list );

        let url_param = {
            user_id : data.user_id,
            room_no : room_no,
            start : data.start ? (data.start) : 0,
            user_type : data.user_type,
            user_no : data.user_no ? data.user_no : 0 ,
            content : data.content,
            user_name : data.user_name ? data.user_name : '',
            message_type : data.message_type ? data.message_type : '',
            knock_btn_no : data.knock_btn_no ? data.knock_btn_no : '',
            memo_no  : data.memo_no ? data.memo_no : '',
            icard_no  : data.icard_no ? data.icard_no : '' ,
            load_no : data.load_no ? data.load_no : 0,
            target_id : data.target_id ? data.target_id : '',
            room_join_list : user_list,
            push_isset : data.push_isset ? data.push_isset : 0
        };

        const result = await network({
            url: "send_message",
            data: url_param,
            promise: true
        });

        if( data.push_isset ){

        }
    
        return result;
    }
    

    // 방 나가기
    async leaveRoom(data: types.IDefaultSocket) {

        const result = await network({
            url: "leave_room",
            data: data,
            promise: true
        });
    
        return result;
    }
}