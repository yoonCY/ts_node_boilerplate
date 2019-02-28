import * as socketio from 'socket.io'
import network from 'src/lib/network';

import { socketObject } from 'src/socket'

import apiMessageClass from 'src/lib/api/iwedding_message'

import * as Dtypes from 'src/types/imessage'
import * as Rtypes from 'src/types/imessage_result'

import { imessage, mysql } from 'src/db'

import imessage_log from 'src/moduls/process/imessage_log'

import {
    date
} from 'src/lib/reshelper'

const apiMessage = new apiMessageClass();

mysql();
export default (io: socketio.Server, socket: socketio.Socket) => {

    let socket_id = socket.id.split('#')[1];
    
    new imessage.chat({
        socket_id: socket_id
    }).save();

    io.to(socket.id).emit('join:authkey', { authkey: socket_id });

    // 해당 socket.id 수신 방 입장 로직 
    socket.on('join:first', async function (data: Dtypes.user_info): Promise<void> {

        imessage_log({
            event_name: "join:first"
        })

        const result: Rtypes.join_first = await apiMessage.first(data);

        imessage.chat.update({
            user_id: data.user_id,
            user_type: data.user_type
        }, {
                socket_id: socket_id,
            }).exec();

        if (result.room_info) {
            result.room_info.map((row: Rtypes.rooms) => {
                socket.join(row.room_no);
            })
        }

    });

    socket.on('join:resend_authkey', async function (data: Dtypes.uuid) {

        imessage_log({
            event_name: "join:resend_authkey"
        })

        const result = await apiMessage.checkUUID(data);

        const user_info = {
            user_id: result.user_id,
            user_type: result.user_type,
            authkey: socket_id,
        }

        let test = await imessage.chat.update({
            user_id: result.user_id,
            user_type: result.user_type,
            device_uuid: data.device_uuid
        }, {
                socket_id: socket_id,
            }).exec();

        io.to(socket.id).emit("join:authkey", user_info);

    });

    // 방 리스트 조회 
    socket.on('join:list', async function (data: Dtypes.user_info) {

        imessage_log({
            event_name: "join:list",
            params: data
        })

        const result: Array<Rtypes.room_list> = await apiMessage.searchRoomList(data);

        io.to(socket.id).emit("list:user_list", result);

    });

    // 방 리스트 단건 조회 
    socket.on('join:list_row', async function (data: any) {

        imessage_log({
            event_name: "join:list_row",
            params: data
        });

        const result: Rtypes.room_list = await apiMessage.searchRoomRow(data);

        io.to(socket.id).emit("list:room_row_info", result);

    });

    // 방 입장 
    socket.on('join:room', async function (data: Dtypes.room_default) {

        imessage_log({
            event_name: "join:room",
            params: data
        });

        try {

            if (typeof data.room_no === 'object') {

                data.room_no.forEach((row: any) => {

                    socket.join(row);
                    new imessage.room({
                        user_id: data.user_id,
                        user_type: data.user_type,
                        socket_id: socket_id,
                        room_no: row,
                        reg_date: date().ymdhis,
                    }).save();

                });
                data.room_no = data.room_no.join(",");
            } else {

                new imessage.room({
                    user_id: data.user_id,
                    user_type: data.user_type,
                    socket_id: socket_id,
                    room_no: data.room_no,
                    reg_date: date().ymdhis,
                }).save();

            }
            console.log('방입장')

        } catch (e) {
            console.log('쿼리 에러', e)
        }

        const result: Array<Rtypes.message_list> = await apiMessage.messageList(data);

        io.to(socket.id).emit("getMessage:list", JSON.stringify(result));

    });

    // 방 참여자 정보 로드
    socket.on('list:room_pt_info', async function (data: Dtypes.room_default) {

        imessage_log({
            event_name: "list:room_pt_info",
            params: data
        });
        data.room_no = data.room_no.join(",");

        const result: Array<Rtypes.pt_list> = await apiMessage.roomUserList(data);

        io.to(socket.id).emit("list:user_pt_info", JSON.stringify(result));

    });

    // 알림 메시지
    socket.on('list:info_message', async function (data: Dtypes.room_default) {

        imessage_log({
            event_name: "list:info_message",
            params: data
        });

        try {
            data.room_no = data.room_no.join(",");
        } catch (e) {
            console.log('err', data.room_no, e)
        }

        const result = await apiMessage.InfoMessage(data);

        if (result) {
            io.to(socket.id).emit("list:user_pt_info", JSON.stringify(result));
        }


    });

    // 메시지 리스트 
    socket.on('list:message_list', async function (data: any) {

        imessage_log({
            event_name: "list:message_list",
            params: data
        });

        try {
            data.room_no = data.room_no.join(",");
        } catch (e) {
            console.log('err', data.room_no, e)
        }

        const result = await apiMessage.messageList(data);

        io.to(socket.id).emit("getMessage:list", JSON.stringify(result));

    });

    // 검색 태그
    socket.on('list:tag', async function (data: any) {

        imessage_log({
            event_name: "list:tag",
            params: data
        });

        console.log("tag", data)
        // io.of('/imessage').in(room_name).emit("getMessage:tag", data)

    });


    // 아이웨딩 방 체크 
    socket.on('join:create_room', async function (data: any) {

        imessage_log({
            event_name: "join:create_room",
            params: data
        });

        try {
            data.room_no = data.room_no.join(",");
        } catch (e) {
            console.log('err', data.room_no, e)
        }

        const result = await apiMessage.checkIweddingRoom(data);

        io.to(socket.id).emit("join:create_rmoom_return", JSON.stringify(result));
        io.to(socket.id).emit("update:room_row", JSON.stringify(result));

    });

    // 메시지 전송
    socket.on('sendMessage:room', async function (data: Dtypes.send_message) {

        data.room_no = [116836, 120941];

        const params = data;

        imessage_log({
            event_name: "sendMessage:room",
            params: data
        });

        try {

            params.room_no.forEach(async (row: any) => {

                data.room_no = row;

                const messageProc: [Rtypes.message_list] = await apiMessage.sendMessage(data, row);
                const update_event_params = JSON.stringify({ room_no: row });
                console.log(messageProc)
                if (messageProc[0]) {

                    if (messageProc[0].message_type === "chat_ent") {

                        // io.of("/with").in("iweddingb").emit("client:messages", JSON.stringify( messageProc ) );
                    }

                    io.in(row).emit("getMessage:message", JSON.stringify( messageProc ) );
                    io.in(row).emit("update:room_row", update_event_params);
                    // socketObject.iweddingb.in( row ).emit("list:update_event", update_event_params);
                }

            });

        } catch (e) {
            console.log('sendMessage ERR :', e)
        }


    });

    // 방나가기
    socket.on('leave:room', async function (data, key) {

        imessage_log({
            event_name: "leave:room",
            params: data
        });

        try {
            data.room_no.map((row: any) => {

                imessage.room.deleteMany({
                    room_no: row
                }).exec();
            });
            data.room_no = data.room_no.join(",");
        } catch (e) {
            console.log('방나가기 오류', e)
        }

        const result = await apiMessage.leaveRoom(data);

    });

    // 소켓종료 
    socket.on("disconnect", async () => {

        imessage.chat.deleteMany({
            socket_id: socket_id
        }).exec();

        console.log("연결종료", socket_id);

    })

}

