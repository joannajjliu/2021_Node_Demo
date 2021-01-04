// This is the startup file of our application.
// It starts the express server and initializes connections to the database.
import path from 'path';
import express from 'express';

import { appointmentRouter } from './api/server';

const app = express();

interface IContext {
  appRoot: string;
}

const context: IContext = {
  appRoot: path.resolve(__dirname) //set global variable for appRoot
};

// NOTE on methods
// order matters:
// app.use works for all HTTP requests.
// app.get only filters for incoming GET requests.
// app.post only filter for incoming POST requests.
// other options: app.delete, app.patch, app.put

app.use(express.json());

const port = 4000; // arbitrary PORT selected

// '/api' path filter, for all routes
app.use('/api', appointmentRouter);

app.listen(port, () => {
  try {
    return console.log(`server is listening on ${port}`);
  } catch {
    return console.log(`opps, failed`);
  }
}).on('error', (err) => {
  console.log("app err", err);
});

export { context };
export default app;