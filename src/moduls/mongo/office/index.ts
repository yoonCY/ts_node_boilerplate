// office 
import user_info from './user'


export default (mongoose: any) => {

    const office = mongoose.connection.useDb('office');
    const userSchema = new mongoose.Schema(user_info);
    const user = office.model("office-user-m", userSchema, "user");


    return {
        user
    }

};






