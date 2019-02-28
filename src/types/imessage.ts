type user_info = {
    user_id : string,
    user_type : string | number,
    user_language ?: number
};

type rooms = {
    room_no : string   
};

type uuid = {
    device_uuid : string
}

interface room_default extends user_info {
    room_no : any
}

interface send_message extends user_info {
    room_no : any,
    content : String,
    start ?: Number,
    user_no ?: String,
    user_name ?: String,
    message_type ?: String,
    knock_btn_no ?: String,
    memo_no ?: String,
    icard_no ?: String,
    load_no ?: String,
    target_id ?: String,
    push_isset ?: Number,
    room_join_list ?: Array<any>
}

export {
    user_info,
    uuid,
    room_default,
    send_message
}