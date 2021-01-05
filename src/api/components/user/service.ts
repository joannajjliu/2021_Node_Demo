// service class is a wrapper for any data store or external dependency.;
// The service would invoke a connector;
// such as a rest - client or db - client to retrieve relevant data.;

import {promises as fs} from 'fs';
import path from 'path';
import { context } from '../../../index';

// import types
import { IUser } from './model';

const readFileAsync = (): Promise<string> => {
  const p = path.join(context.appRoot, 'api', 'data', 'users.json');
  try {
    const fileContent = fs.readFile(p, 'utf-8');
    return fileContent;
  } catch(err) {
    console.log("readFile err", err);
  }
};

export const writeFileAsync = (callback: any): void => {
  const p = path.join(context.appRoot, 'api', 'data', 'users.json');
  try {
    fs.writeFile(p, callback);
  } catch(err) {
    console.log("writeFile err", err);
  }
};

const saveUser = async (user: IUser) => {
  const userCopy = { ...user }; // shallow copy of user
  const userName = userCopy.userName;
  const email = userCopy.email;

  let resStatus = 500; // status 500 generic Internal Server Error
  let resObj = {}; // resObj to hold additional information, as applicable

  return readFileAsync().then((fileContent) => {
    let users = [];
    users = JSON.parse(fileContent);
    const usersOriginalLen = users.length;

    if (usersOriginalLen === 0) {
      resStatus = 201;
      users.push(user);
      resObj = { ...userCopy }; //create shallow copy
    } else {
      for (let i = 0; i < usersOriginalLen; i++) {//check if user username, or email already exists
        if (users[i].userName === userName) {
          resStatus = 409; // status 409 for duplicate resource, or resource already exists
          resObj['DUPLICATE_ERR'] = 3; //arbitrary number 3, when duplicate is userName
          break;
        }
        if (users[i].email === email) {
          resStatus = 409;
          resObj['DUPLICATE_ERR'] = 5; //arbitrary number 5, when duplicate is email
          break;
        }
        if (i === usersOriginalLen - 1) {
          resStatus = 201;
          users.push(user);
          resObj = { ...userCopy }; //create shallow copy
        }
      }
    }

    return { users, resStatus, resObj }
    
  }).then(({users, resStatus, resObj}) => {
    writeFileAsync(JSON.stringify(users));
    return { resStatus, resObj };
  });
};

export {
  saveUser
}