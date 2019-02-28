import * as http from 'http'
import * as express from "express";
import * as socketio from "socket.io";

import {
    icu,
    iwedding
} from 'src/lib/socket';

let socketConn : socketio.Server;

export let socketObject : any = {};

export default ( httpServer : http.Server , io : socketio.Server ) => {
 
    socketConn = io.listen( httpServer );

    socketObject.default = socketConn;
    socketObject.icu = socketConn.of( "icu" );
    socketObject.iwedding = socketConn.of( "imessage" );
    socketObject.APP = socketConn.of( "APP" );

    socketConn.on('connection', function (socket : any) {
        // 클라이언트 네임스페이스
        
    });
    
    socketObject.icu.on("connection", ( socket : any ) => {
        
        icu( socketObject.icu, socket  )
    })

    socketObject.iwedding.on("connection", ( socket : any ) => {
        iwedding( socketObject.iwedding, socket  )
    })

    socketObject.APP.on("connection", ( socket : any ) => {
        console.log('test')
    })
}
