/**
 * 방 번호
 */
type room_info = {
    room_no : number
}

/**
 * 방 리스트 
 */
type room_list = {
    room_type : string,
    room_last_active_time: string,
    with_id : string,
}

export type IDefaultSocket = {
    user_id : string,
    user_type : number,
    user_language : number
}

export type IDefaultkey = string;

export interface join_first_params extends IDefaultSocket{
    
}

export interface join_first_result{
    room_info ?: [ room_info ]
}

export interface room_list_result{
    room_info ?: [ room_info ]
}