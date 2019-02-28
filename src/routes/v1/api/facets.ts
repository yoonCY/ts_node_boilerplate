import { Router } from 'express';

let count = 0;

export default () => {

	let router = Router();
	router.get('/', (req, res) => {		
		res.json({ "test" : 1 });
	});

	return router;
}
