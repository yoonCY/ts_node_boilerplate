export default {
    user_id : String,
    user_type : String,
    user_pw : String,
    // device_uuid : "String",
    socket_id : { type : 'String', default : ""},
    team : { type : String, default : "dev" },
    active : { type: 'Number' , default : 0 },
    login_time : String,
    logout_time : String
};
