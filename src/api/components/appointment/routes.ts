// The routes class define our API endpoints for the corresponding component,
// and assign their corresponding action / controller methods.;

import express from 'express';

import { getAppointments, postBookAppointment, putBookAppointment, deleteAppointment } from './controller';

//router works similar to app, but is used to split routes across multiple files
const router = express.Router();

router.get('/appointments', getAppointments);

router.post('/appointments/book', postBookAppointment);

router.put('/appointments/book', putBookAppointment);

router.delete('/appointments/:appointmentId', deleteAppointment);

export default router;