import * as express from 'express'
import { version } from 'package-config';
import { Router } from 'express';
import api from 'src/routes/v1/api'

import { office, redis } from 'src/db'

export default () => {
	let router = Router();

    router.use(function (req, res, next) {

        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', '*');
        // http://localhost:7470

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', "true");

        // Pass to next layer of middleware
        next();
    });

	router.use("*", function (req, res, next) {

        console.log("@@@@@@ DEBUG START @@@@@@");
        console.log(`URL : /${req.params.Router}/${req.params.URL}`);
        console.log("method : ", req.method);
		console.log(req.originalUrl)
		console.log(req.baseUrl )

        switch (req.method) {
            case "GET":
                console.log("GET : ", req.query);
                break;
            case "POST":
                console.log("POST : ", req.body);
                //         req.session.user_id = req.body.user_id;
                // console.log(req.session)
                break;
        }

        console.log("@@@@@@ DEBUG END @@@@@@");

        next();
    });
    
    router.use("/api", api() );

	return router;
}
