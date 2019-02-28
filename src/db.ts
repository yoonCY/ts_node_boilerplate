import * as mongoose from 'mongoose';

import icuMongoDB from 'src/moduls/mongo/icu'
import officeMongoDB from 'src/moduls/mongo/office'
import imessageMongoDB from 'src/moduls/mongo/imessage'
import { Z_BUF_ERROR } from 'zlib';

const async_redis = require("async-redis");
const mysqlDB = require('mysql2');

const client = async_redis.createClient();

const autoIncrement = require('mongoose-auto-increment');

mongoose.connect('mongodb://localhost/default', { useNewUrlParser: true });
const mongo_connection =  mongoose.connection;

autoIncrement.initialize(mongo_connection);


client.on('error', (err : any) => {
    console.log("Error " + err);
});

client.cset = async ( key : string, value : string | number | object = "" ) => {
    
    if( value === "" ) {
        console.log("redis cget value null")
        return;
    }
    
    switch( typeof value ){
        case "object" :
            value = JSON.stringify(value);
            break;
        default : 
            break;
    }    

    await client.set( key, value );

    return await client.get( key );
}

const mysql_info = {
    host     : 'localhost',
    user     : 'root',
    password : '4112',
    database : 'ifamily',
    connectionLimit: 100
};

let pool = mysqlDB.createPool( mysql_info );
let promisePool = pool.promise();

const mysql_process = async () => {
    let return_data = {
        result : false,
        data : {},
        desc : ""
    };
    
    try{
        const query = await promisePool.query("select * from ifamily.test2 where no = 2 limit 1");

        return_data.result = true;
        return_data.data = query[0];

    }catch( e ){
        
        return_data.desc = e.message;

    }
    
    return return_data;
}

export const icu : any = icuMongoDB( mongoose, autoIncrement );
export const office : any = officeMongoDB( mongoose );
export const imessage : any = imessageMongoDB( mongoose );
export const redis : any = client;
export const mysql : any = mysql_process;


