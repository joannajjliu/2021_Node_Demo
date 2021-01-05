// In server.ts everything necessary for the express server is declared.
// For example, error handling, importing component routes and middleware.;

// import everything in /api here 
// export everything

import { appointmentRouter, availabilityRouter, userRouter } from './routes';

export {
  appointmentRouter,
  availabilityRouter,
  userRouter
};
