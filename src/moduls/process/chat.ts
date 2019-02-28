import { office, icu, redis } from 'src/db'
import { returnData, date } from 'src/lib/reshelper'

import {
    socketObject
} from 'src/socket'

type Isearch_user_query = {
    user_id: string,
}



export default class {

    // 방 생성
    async create_room(params: any) {

        let return_data;
        
        const save_model = new icu.room(params);

        let room_check = await icu.room.findOne({
            room_list : params.room_list
        });

        if( room_check ){
            // return returnData(false, null, "이미 해당 채팅방이 존재합니다.");
        }
       
        let room_info = await save_model.save();
        
        // 저장후 
        let user_list = await office.user.find({
            user_id : {
                $in : params.room_list
            }
        }, { user_id : 1 } );
        
        

        user_list.forEach( async ( row : any ) => {
            
            let user_cerate_room = await new icu.myroom({
                user_id : row.user_id,
                room_no : room_info._id,
                reg_date : date().ymdhis
            }).save();

            socketObject.icu.in( `icu:user:${row.user_id}` ).emit(
                "room_create_event", {
                    room_no : room_info._id
                }
            );
        });

        return returnData(true, room_check, "방 생성 성공");
    }

    // 방 리스트 
    async Search_myRoomList ( params : any ){
        
        const room_list = await icu.myroom.find({
            user_id : params.user_id
        })

        return returnData(true, room_list, "room_list 조회 완료");

    }

    // 방 리스트 row 
    async Search_myRoomRow ( params : any ){

        const room_list = await icu.myroom.findOne({
            room_no : params.room_no,
            user_id : params.user_id
        })
        
        if( !room_list ){
            return returnData(false, null, "방이 존재하지 않습니다.");    
        }

        return returnData(true, room_list, "room_row 조회 완료");

    }

}