// import types
import { Request, Response, NextFunction } from 'express';

import Availability from './model';

import {
  updateAvailability,
  fetchAllAvailabilities
} from './service';


const putAvailability = async (req: Request, res: Response, next: NextFunction) => {
  const { doctorId, doctorName, schedule } = req.body;
  const availability = new Availability(doctorId, doctorName, schedule);
  const { resStatus, resObj } = await updateAvailability(availability);
  if (resStatus === 201) {
    res.status(resStatus).json(resObj);
  } else if (resStatus === 204) {
    res.status(resStatus).end();
  } else {
    res.end();
  }
}

const getAvailabilities = async (req: Request, res: Response, next: NextFunction) => {
  const availabilities = await fetchAllAvailabilities();
  res.json(availabilities);
};

export {
  putAvailability,
  getAvailabilities
}