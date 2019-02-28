import { version } from 'package-config';
import { Router } from 'express';

import facets from './facets';
import member from './member';
import chat from './chat';

export default () => {
	let api = Router();

	api.use("/facets", facets() );
	api.use("/member", member() );
	api.use("/chat", chat() );

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

	return api;
}
