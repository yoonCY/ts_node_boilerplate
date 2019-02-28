import * as socketio from 'socket.io'
import network from 'src/lib/network';

import { socketObject } from 'src/socket'

import apiMessageClass from 'src/lib/api/iwedding_message'

import * as types from 'src/types/icu'

import { office, icu } from 'src/db'

import {
    date
} from 'src/lib/reshelper'

import room from 'src/moduls/mongo/icu/room';

const apiMessage = new apiMessageClass();

export default (io: socketio.Server, socket: socketio.Socket ) => {

    let socket_id = socket.id.split('#')[1];

    console.log( "icu 접근 " )

    socket.on("start", async ( data : types.user_id ) => {

        // 참여중인 방 조회 
        const room_list = await icu.room.find({
            room_list : {
                $in : data.user_id
            }
        }).exec();

        // 전체 알림용
        socket.join( `icu:all`);
        // 개인 알림용 
        socket.join( `icu:user:${data.user_id}` );

        // 
        office.user.updateOne({
            user_id : data.user_id,
        }, {
            socket_id : socket_id,
            active : 1,
            login_time : date().ymdhis
        }).exec();

        room_list.forEach( ( row : any ) => {
            // 방 알림용 
            socket.join( `icu:room:${row._id}` );
        });

        // 전체방에 로그인 전달 
        socket.in( "icu:all").emit("login", {
            user_id : data.user_id
        });
    })  

    socket.on("list", async( data : any ) => {

    });

    socket.on("disconnect", async() => {

        // 사용자 정보 획득 
        const user_info = await office.user.findOne({
            socket_id : socket_id
        }).exec();
        
        // user_info
        office.user.updateOne({
            user_id : user_info.user_id
        },{
            socket_id : "",
            active : 0,
            logout_time : date().ymdhis
        }).exec()

        // 전체방에 로그인 전달 
        socket.in( "icu:all").emit("logout", {
            user_id : user_info.user_id
        });

    });

}

