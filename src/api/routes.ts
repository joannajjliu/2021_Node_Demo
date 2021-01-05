// The routes file is used to define and register all global routes.

// import all in api
// export all routes > import into server.ts
import { appointmentRouter, availabilityRouter, userRouter } from './components';

export {
  appointmentRouter,
  availabilityRouter,
  userRouter
}