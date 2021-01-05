// service class is a wrapper for any data store or external dependency.;
// The service would invoke a connector;
// such as a rest - client or db - client to retrieve relevant data.;

import {promises as fs} from 'fs';
import path from 'path';
import { context } from '../../../index';

// import types
import { IAppointment } from './model';
import { IAvailabilities, IAvailability } from '../availability/model';

// import Availability service
import { fetchAllAvailabilities } from '../availability/service';

const readFileAsync = (): Promise<string> => {
  const p = path.join(context.appRoot, 'api', 'data', 'appointments.json');
  try {
    const fileContent = fs.readFile(p, 'utf-8');
    return fileContent;
  } catch(err) {
    console.log("readFile err", err);
  }
};

export const writeFileAsync = (callback: any): void => {
  const p = path.join(context.appRoot, 'api', 'data', 'appointments.json');
  try {
    fs.writeFile(p, callback);
  } catch(err) {
    console.log("writeFile err", err);
  }
};

const updateDoctorName = async (appointment: IAppointment): Promise<IAppointment> => {
  const appointmentCopy = { ...appointment }; // create shallow copy of appointment for use in function
  
  const availabilities: IAvailabilities = await fetchAllAvailabilities();
  const doctorId = appointmentCopy.doctorId;
  let doctorName = null;

  for (let i = 0; i < availabilities.availabilities.length; i++) {
    const availability: IAvailability = availabilities.availabilities[i];
    if (availability.doctorId === doctorId) {
      doctorName = availability.doctorName;
      break;
    }
  }

  appointmentCopy.doctorName = doctorName; // modify doctorName attribute in appointment
  return appointmentCopy;
};

const saveAppointment = async (appointment: IAppointment): Promise<IAppointment> => {
  const appointmentCopy: IAppointment = await updateDoctorName(appointment);

  return readFileAsync().then((fileContent) => {
    let appointments = [];
    appointments = JSON.parse(fileContent);
    appointments.push(appointmentCopy);

    writeFileAsync(JSON.stringify(appointments));
    return appointmentCopy;
  })
};

const updateAppointment = async (appointment: IAppointment) => {
  const appointmentCopy: IAppointment = await updateDoctorName(appointment);
  let resStatus: number = 500; // status 500 generic Internal Server Error

  return readFileAsync().then(fileContent => {
    const appointments = JSON.parse(fileContent) || [];

    const appointmentsOriginalLen = appointments.length;

    const appointmentId = appointmentCopy.appointmentId;

    if (appointmentsOriginalLen === 0) {//first entry
      resStatus = 201;  // 201 CREATE response status when appointment does not exist
      appointments.push(appointmentCopy);
    } else {
      for (let i = 0; i < appointmentsOriginalLen; i++) {
        if (appointments[i].appointmentId === appointmentId) {
          resStatus = 204; // 204 No Content, item successfully updated
          appointments.splice(i, 1, appointmentCopy);
          break;
        } else if (i === appointmentsOriginalLen - 1) {
          resStatus = 201;  // 201 CREATE response status when appointment does not exist
          appointments.push(appointmentCopy);
          break;
        }
      }
    }

    return { appointments, resStatus, resObj: appointmentCopy };

  }).then(({appointments, resStatus, resObj}) => {
    writeFileAsync(JSON.stringify(appointments));
    return { resStatus, resObj };
  })
};

const deleteAppointment = (appointmentId: string) => {
  readFileAsync().then((fileContent) => {
    const appointments = JSON.parse(fileContent) || [];

    const appointmentsOriginalLen = appointments.length;

    for (let i = 0; i < appointmentsOriginalLen; i++) {
      if (appointments[i].appointmentId === appointmentId) {
        appointments.splice(i, 1);
        console.log(`appointment ${appointmentId} successfully deleted`);
        break;
      }
    }
    return appointments;
  }).then((appointments) => {
    writeFileAsync(JSON.stringify(appointments));
  })
};

const fetchAllAppointments = (callback: any) => {
  readFileAsync().then((fileContent) => {
    callback(JSON.parse(fileContent));
  })
};

export {
  saveAppointment,
  updateAppointment,
  deleteAppointment,
  fetchAllAppointments
};
