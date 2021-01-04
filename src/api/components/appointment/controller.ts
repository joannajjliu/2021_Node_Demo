// The controller class acts as a handler for incoming requests. 
// It would validate requests and generate a response data back to the client.
// It uses the service class to interact internal and external dependencies (ie. databases, apis, etc).

import { v4 as uuidv4 } from 'uuid';

// import types
import { Request, Response, NextFunction } from 'express';

import Appointment, { IAppointment } from './model';
import {
  saveAppointment,
  updateAppointment,
  deleteAppointment as deleteAppointmentService,
  fetchAllAppointments
} from './service';

const postBookAppointment = async (req: Request, res: Response, next: NextFunction) => {
  const { doctorId, patientName, startTime, endTime } = req.body;
  const [ appointmentId, doctorName ] = [ uuidv4(), null ];
  const appointment = new Appointment(appointmentId, doctorId, doctorName, patientName, startTime, endTime);
  const modifiedAppointment = await saveAppointment(appointment);
  // End a call with one of .end(), .send(), or .json()
  res.status(201).json(modifiedAppointment); // 201 CREATED
}

const putBookAppointment = async (req: Request, res: Response, next: NextFunction) => {
  const { appointmentId, doctorId, patientName, startTime, endTime } = req.body;
  const doctorName = null;
  const appointment = new Appointment(appointmentId, doctorId, doctorName, patientName, startTime, endTime);
  const { resStatus, resObj } = await updateAppointment(appointment);
  if (resStatus === 201) {
    res.status(resStatus).json(resObj);
  } else if (resStatus === 204) {
    res.status(resStatus).end();
  } else {
    res.end();
  }
}

const deleteAppointment = (req: Request, res: Response, next: NextFunction) => {
  const appointmentId = req.params.appointmentId;
  deleteAppointmentService(appointmentId);
  res.status(204).end(); // 204 status, NO CONTENT
}

const getAppointments = (req: Request, res: Response, next: NextFunction) => {
  fetchAllAppointments((appointments: IAppointment[]) => {
    // Optionally set status; default success status is 200 
    res.status(200).json(appointments);
  });
};

export {
  postBookAppointment,
  putBookAppointment,
  deleteAppointment,
  getAppointments
}