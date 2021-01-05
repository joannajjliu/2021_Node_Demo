// API-contract: merging /api/doctors and /api/availability into one

import express from 'express';

import { getAvailabilities, putAvailability } from './controller';

//router works similar to app, but is used to split routes across multiple files
const router = express.Router();

router.get('/availabilities', getAvailabilities);

router.put('/availabilities', putAvailability);

export default router;
