// service class is a wrapper for any data store or external dependency.;
// The service would invoke a connector;
// such as a rest - client or db - client to retrieve relavent data.;

import {promises as fs} from 'fs';
import path from 'path';
import { context } from '../../../index';

// import types
import { IAvailability, IAvailabilities } from './model';

const readFileAsync = (): Promise<string> => {
  const p = path.join(context.appRoot, 'api', 'data', 'availabilities.json');
  
  try {
    const fileContent = fs.readFile(p, 'utf-8');
    return fileContent;
  } catch(err) {
    console.log("readFile err", err);
  }
};

export const writeFileAsync = (callback: any): void => {
  const p = path.join(context.appRoot,'api', 'data', 'availabilities.json');
  try {
    fs.writeFile(p, callback);
  } catch(err) {
    console.log("writeFile err", err);
  }
};

const updateAvailability = async (availability: IAvailability) => {
  const availabilityCopy = { ...availability };
  let resStatus: number = 500; // status 500 generic Internal Server Error

  return readFileAsync().then((fileContent) => {
    const availabilities = JSON.parse(fileContent).availabilities || [];

    const availabilitiesOriginalLen = availabilities.length;

    const doctorId = availabilityCopy.doctorId;

    if (availabilitiesOriginalLen === 0) { //availabilities array is empty
      resStatus = 201;  // 201 CREATE response status when appointment does not exist
      availabilities.push(availabilityCopy);
    } else {
      for (let i = 0; i < availabilitiesOriginalLen; i++) {
        if (availabilities[i].doctorId === doctorId) {
          resStatus = 204; // 204 No Content, item successfully updated
          availabilities.splice(i, 1, availabilityCopy);
          break;
        } else if (i === availabilitiesOriginalLen - 1) {
          resStatus = 201;  // 201 CREATE response status when appointment does not exist
          availabilities.push(availabilityCopy);
          break;
        }
      }
    }

    return { availabilities, resStatus, resObj: availabilityCopy };
    
  }).then(({ availabilities, resStatus, resObj }) => {
    writeFileAsync(JSON.stringify({ "availabilities": availabilities }));
    return { resStatus, resObj };
  });
};

const fetchAllAvailabilities = async () : Promise<IAvailabilities> => {
  return readFileAsync().then((fileContent) => {
    return JSON.parse(fileContent);
  })
};

export {
  updateAvailability,
  fetchAllAvailabilities
}