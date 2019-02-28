"use strict";


const default_url = "http://www.ifamily.co.kr/icard/chat/";

const urlConfig : any = {
    get_user_info : "get_user_info",
    get_room_list_simple : "get_room_list_simple",
    get_room_list : "get_room_list",
    get_room_row : "get_room_row",
    get_message_list : "get_message_list",
    get_room_pt_list : "get_room_pt_list",
    get_info_message : "get_info_message",
    create_iwedding : "create_iwedding",
    get_tag_list : "get_tag_list",
    leave_room : "leave_room",
    send_message : "send_message",
};

export default ( url : string ) : string => default_url+urlConfig[ url ]