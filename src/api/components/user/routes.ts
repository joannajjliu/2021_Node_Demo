import express from 'express';

import { postUser } from './controller';

//router works similar to app, but is used to split routes across multiple files
const router = express.Router();

router.post('/users', postUser);

export default router;
