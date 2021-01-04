# [Commit Stages](https://github.com/joannajjliu/2021_Node_Demo/commits/main)

**The goal of each commit is summarized in the titles of the commits below.** *Detailed instructions on the actions taken to achieve each commit is further provided in numbered bullets under each commit.*
## [Commit 1](https://github.com/joannajjliu/2021_Node_Demo/commit/192fc37e9ca5900aad634edf69670704144151c1) - Express generator

1. [Reference 1.1](https://expressjs.com/en/starter/generator.html)
2. `npx express-generator --view=pug myapp`
3. `npm i`

## [Commit 2](https://github.com/joannajjliu/2021_Node_Demo/commit/f22ddbed38e9462e40df737bd8f11678d84792ee) - Implement Typescript (TS)

1. [Reference 2.1](https://www.digitalocean.com/community/tutorials/setting-up-a-node-project-with-typescript)
2. [Reference 2.2: More about tsconfig file values](https://www.typescriptlang.org/docs/handbook/compiler-options.html)
3. Instructions, as per Reference 2.1:

    - Here, we'll **just be adding typescript**, without removing any of the generated files. *Removal and re-organization of generated files will be done in Commit 3*
    - `npm i -D typescript tslint @types/express@4.16.1` (match @types/express with the express version installed, found in package.json)
    - Create a tsconfig.json file in the root folder. Copy its contents from this repo.
    - Create a tslint.json file in the root folder. Copy its contents from this repo.
    - To watch for file changes, we need to run both scripts, `tsc -w` for TS changes, and `nodemon dist/index.js` for JS changes after TS compile. To run both these scripts at the same time, install two more packages: `npm i -D concurrently nodemon`
    - Modify package.json:
      - OPTIONAL: In devDependencies and dependencies, change all `^` to `~`. [Read more about the difference](https://stackoverflow.com/questions/22343224/whats-the-difference-between-tilde-and-caret-in-package-json).
      - Add `"main": "dist/index.js", "license": "ISC".` Change start script to `"start": "tsc && concurrently \"tsc -w\" \"nodemon dist/index.js\""`
    - Create src folder. Add index.ts file in it. Refer to [commit 2](https://github.com/joannajjliu/2021_Node_Demo/commit/f22ddbed38e9462e40df737bd8f11678d84792ee) for index.ts contents.
    - Run `npm start` in the root folder: /dist folder and files are generated. In the terminal, you should see "server is listening on 3000". Navigate to <http://localhost:3000> in the browser. Should see "The sedulous hyena ate the antelope" on the client-side.
  
## Commit 3 - Create folder structure as outlined in API-Folder-Structure

1. Follow structure outlined in API-Folder-Structure.md (link in lunch & learn PPT), creating necessary folders and files.

    - Since we will begin our work on the appointment API in Commit 4, we will create only the necessary controller.ts, model.ts, routes.ts, and service.ts files in the src/api/components/appointment directory, ignoring the /availability, and /user directories for now.

2. Remove generated files that will no longer be used:

    - Delete /routes, /views, /public, /bin folders and all their contents from root directory
    - We will keep the generated app.js file in the root directory for now, as reference (ex. error handler code) for later.

3. Run `npm start` in terminal of root folder, to ensure everything is still working (i.e. Navigate to <http://localhost:3000> in the browser. We should still see "The sedulous hyena ate the antelope" on the client-side)

## Commit 4 - Fill in code for Appointment API

1. Refer to references/API-Contracts - Overview.pdf (link in lunch & learn PPT) for the various API request and response contents. **NOTE** different from the contract:
    - The APIs we will be implementing will be more specific. This includes the success status codes, which will be split into 201, 204 and 200 status codes.
    - The response bodies which are not specified in the contract, will be specific to the type of HTTP methods being called:
        - GET returns 200 with the requested response json object
        - DELETE returns 204 No Content response
        - POST returns 201 Create with created appointment json response
        - PUT returns 204 No Content when AppointmentID exists, else it will return 201 Create with created appointment json
    - For this demo, we will be combining /api/doctors and /api/availability apis into a single /api/availability API, due to redundancy.

2. Notice in `POST /api/appointments/book` method, the request body does not include neither **appointmentId**, nor **doctorName**, both of which are returned in the response body of `GET /api/appointments` method:

    - For **doctorName**, we will *submit as null* for now, until we implement the availability API, from which we can link doctorId to doctorName *(to be done in Commit no.6)*
    - The **appointmentID**, in the POST method will be randomly generated, upon creation of the appointment. For its random generation, we will be using uuid.v4() method. To do so, we must first install the [uuid package](https://www.npmjs.com/package/uuid): `npm i uuid` then `npm i -D @types/uuid`

3. Due to the relation between availability (doctor) and appointment data, a SQL database will likely be the best selection for data store in this appointments' booking project. However, since this demo is primarily covering the Node.js backend service, we will be simplifying data treatment in this demo, and instead store our data as local json files.

    - For appointments, we will create a data folder under /src/api directory, and add an appointments.json file. In it, we will create an empty array: `[]`
    - NOTE: Because in tsconfig.json, we have `"resolveJsonModule": true`, and `"include": ["src/**/*.json", ...]`, during typescript compile (i.e `tsc -w` part of the npm start script), any json files in /src directory will be automatically copied into the /dist directory, which is then watched and run by nodemon (i.e. `nodemon dist/index.js` part of the npm start script)

4. Next, we will fill in the code necessary for Appointment API:

    1. Since we are using Typescript and for consistency, we will **use ES6 import/export syntax** (instead of commonJS 'require' and 'module.exports' syntax) throughout our application
    2. Folder structure:

        - /src/index.ts acts as the startup file for our application. All exports from the Appointment API code will ultimately be imported into this file.
        - Code exported from **/src/api/components/appointment directory** will be imported, then exported again, from **/src/api/components/index.ts file**. This exported code is then imported into **/src/api/routes.ts file**, which is again exported. This exported code is then imported into **/src/api/server.ts file**, which is then exported, and again imported into the root **/src/index.ts** file.
        - This import and export folder structure, is meant to model a large production level project. For the purposes of our application, we will still be using this folder structure, although it is slightly excessive for our simple appointments' service application.

    3. MVC code structure (inside /src/api/components directory):
        - **/appointment/model.ts** holds the model for the Appointment object. In the committed code, this is done using a class constructor method. Export Appointment class and interface for later use.
        - **/appointment/service.ts** holds the helper functions for /appointment/controller.ts. That is, in this demo, it includes code for reading/writing to json files, as well as the main logic for deleting and adding to the appointment objects' array.
        - **/appointment/controller.ts**, holds the wrapper code for GET, PUT, POST, DELETE appointments. It accepts the request body, then calls the relevant code from /appointment/service.ts, then returns the correct response body with status code:
            - GET returns 200 with the requested response json object
            - DELETE returns 204 No Content response
            - POST returns 201 Create with created appointment json response
            - PUT returns 204 No Content when AppointmentID exists, else it will return 201 Create with created appointment json
        - **/appointment/routes.ts** calls the appropriate controller code from /appointment/controllers.ts, and links it to a relavant route, using .get, .post, .put, or .delete methods of express.Router(). express.Router() is then exported, for use in the root /src/index.ts file
