import * as express from "express";
import * as cors from 'cors';
import * as morgan from 'morgan';

import * as bodyParser from 'body-parser';
// import * as socketio from "socket.io";

import * as path from "path"

// routes
import routeV1 from 'src/routes/v1'

// socket
import connectSocket from 'src/socket'


import * as config from 'app-config';

const favicon = require('static-favicon');

const app = express();
const port = 3000;


app.set('views', './views');
app.set('view engine', 'ejs');
app.set("port", process.env.PORT || config.port );

app.use(favicon());

// logger
app.use(morgan('dev'));

app.use(bodyParser.json() );

const http = require('http').Server(app);
const io = require('socket.io')(http, { serveClient: false })

/** 
 * routes
 */
app.use('/v1/', routeV1());


connectSocket( http, io );

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    let err : any = new Error('정상적인 경로로 진입하지 않았습니다.');
    err.status = 404;
    next(err);
});

// production error handler
// no stacktraces leaked to user
app.use(function(err : any , req : express.Request, res : express.Response, next : express.NextFunction) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

http.listen(app.get('port'), function () {
    console.log(`listening on *: ${app.get('port')}`);
});

export default app;
