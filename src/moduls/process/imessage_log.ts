import { imessage } from 'src/db'

import {
    date
} from 'src/lib/reshelper';

type Iinsert_log_query = {
    event_name : String,
    type ?: String,
    log_date ?: String,
    params ?: any
}

export default async ( log_query : Iinsert_log_query ) : Promise<void> => {

    let query = {
        event_name : log_query.event_name,
        type : ( log_query.type ) ? log_query.type : "socket",
        log_date : date(null).ymd
    };

    let params = ( log_query.params ) ? log_query.params : ""
    console.log(query)
    let log_check = await imessage.log.findOne( query );

    if( log_check ){
         imessage.log.updateOne( query, { $inc: { count: 1 },  params : params }).exec() 
    }else{
        new imessage.log( {
            event_name : query.event_name,
            type : query.type,
            log_date : query.log_date,
            params : params
        } ).save();
    }

}