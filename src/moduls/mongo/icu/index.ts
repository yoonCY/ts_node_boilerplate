// icu 
import myroom_lnfo from './myroom'
import room_lnfo from './room'
import chat_lnfo from './chat'

export default ( mongoose : any, autoIncrement :any ) => {

    const icu = mongoose.connection.useDb('icu');

    const myroomSchema = new mongoose.Schema(myroom_lnfo);
    const roomSchema = new mongoose.Schema(room_lnfo);
    const chatSchema = new mongoose.Schema(room_lnfo);
    
    roomSchema.plugin( autoIncrement.plugin, "room" );

    const myroom = icu.model("icu-myroom-m", myroomSchema, "myroom");
    const room = icu.model("icu-room-m", roomSchema, "room");
    const chat = icu.model("icu-chat-m", roomSchema, "chat");

    return {
        myroom,
        room,
        chat
    }

};




