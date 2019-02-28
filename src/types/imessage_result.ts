type user_info = {
    user_id :  String,
    user_type : Number | String
};

type rooms = {
    room_no : any   
};

type join_first = {
    room_info : [ rooms ]
}

interface join_resend_authkey extends user_info {
    room_info : [ rooms ]
}

type room_list = {
    room_type: String,
    room_last_active_time: String,
    with_id: String,
    room_create_id: String,
    room_last_content: String,
    room_pt_title: String,
    ent_code: String,
    room_member_count: String,
    room_pt_no: String,
    room_pt_type: String,
    user_id: String,
    room_pt_time: String,
    room_pt_active_time: String,
    room_pt_alarm: String,
    room_pt_like: String,
    room_pt_not_read: String,
    room_pt_read_no: String,
    room_pt_status: String,
    room_pt_name: String,
    room_pt_hide: String,
    read_flag: String,
    profile_img: String,
}

type message_list = {
    no: String,
    to_id: String,
    with_id: String,
    from_id: String,
    from_name: String,
    type: String,
    time: String,
    content: String,
    room_no: String,
    user_type: String,
    event_code: boolean | String,
    event_value1: boolean | String,
    message_type: String
}

type pt_list = {
    user_type: String,
    user_id: String,
    user_name: String,
    profile_img: String,
    room_no: String,
}

export {
    user_info,
    rooms,
    join_first,
    room_list,
    message_list,
    pt_list
}