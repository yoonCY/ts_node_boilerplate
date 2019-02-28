// imessage
import log_info from './log'
import chat_info from './chat'
import room_info from './room'


export default (mongoose: any) => {

    const imessage = mongoose.connection.useDb('imessage');
    
    const logSchema = log_info( mongoose );
    const chatSchema = new mongoose.Schema(chat_info);
    const roomSchema = new mongoose.Schema(room_info);

    const log = imessage.model("imessage-log-m", logSchema, "event_start_log");
    const chat = imessage.model("imessage-chat-m", chatSchema, "chat");
    const room = imessage.model("imessage-room-m", roomSchema, "room");


    return {
        log,
        chat,
        room
    }

};






