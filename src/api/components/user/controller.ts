// import types
import { Request, Response, NextFunction } from 'express';

import User from './model';

import {
  saveUser
} from './service';


const postUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, userName, password, email } = req.body;
  
  const user = new User(name, userName, password, email);
  const { resStatus, resObj } = await saveUser(user);
  
  res.status(resStatus).json(resObj);
}

export {
  postUser
}