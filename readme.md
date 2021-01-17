# [Commit Stages](https://github.com/joannajjliu/2021_Node_Demo/commits/main)

**The goal of each commit is summarized in the titles of the commits below.** *Detailed instructions on the actions taken to achieve each commit is further provided in numbered bullets under each commit.*
**Disclaimer:** The following instructions and repo code, is only one way to obtain the desired results. Since technology is always evolving, and as there are limitless ways to code a single "Hello World", likewise there are different as well as probably better ways to come to the final results as indicated in the [API contract](./references/API-Contracts%20-%20Overview.pdf), and commit titles:
**Please leave a comment**, or PR, for any part of the code/instructions which you believe can be done differently/ better.
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
        - **/appointment/routes.ts** calls the appropriate controller code from /appointment/controllers.ts, and links it to a relevant route, using .get, .post, .put, or .delete methods of express.Router(). express.Router() is then exported, for use in the root /src/index.ts file

## Commit 5 - Create Supertests for Appointment API

1. Our tests will use [Mocha](https://mochajs.org/#getting-started) as the test framework, and [Supertest](https://www.npmjs.com/package/supertest) to test HTTP calls. NOTE that supertest does not mock the data. Either we mock it ourselves, or supertest will modify the actual data in our data store. For now, we will keep supertest calling the same json file as the actual Appointment service. In Commit 7 (Fine-tuning), we will create a separate json file specifically for testing Appointment, and split the routes used for testing, vs development: `npm i -D mocha supertest @types/supertest @types/mocha`
2. In package.json, add a test script: `"test": "mocha --watch"`
3. In the root directory, create a .mocharc.json file. Copy the contents of .mocharc.json file in this repo into your locally created .mocharc.json file:
    - **Install** `npm i ts-node`. You'll need this library for tests, as structured in this repo: to watch for changes in typescript files directly, without needing to first compile to javascript.
    - Notice the `--watch` flag in the test script as well as the `"watch": true` in the .mocharc.json file. Both watch are required, in order to watch both changes in test (.spec.ts) files, as well as changes in typescript files.
    - Notice the `"spec": "**/*.spec.ts"` property in .mocharc.json. This registers any files with extension `.spec.ts` as test files, and will be run by Mocha.
4. In /src/api/components/appointment directory, create a test file, `appointment.spec.ts`. If you aren't familiar with supertest, follow the documentation for [Supertest](https://www.npmjs.com/package/supertest) to create tests for GET, POST, PUT, and DELETE appointment:
    - In /src/api/components/appointment/service.ts from commit 4, the path p in readFileAsync and writeFileAsync functions, uses a root directory of `path.dirname(require.main.filename)`. Unfortunately, this path links to whichever root directory a script is being run from.
    In the case of mocha (i.e. during `npm run test`), its root directory is `/node_modules/mocha/bin`. However, we want to keep the root directory as `/src` for our API tests calls. Therefore, we declare a global context variable, with appRoot property, in the src/index.ts file. We then import the context into the Appointment service.ts file, to access the global appRoot value.

    ```javascript
    // src/index.ts
    const context = {
        appRoot: path.resolve(__dirname) //set global variable for appRoot
    };

    export { context };
    ...

    // src/api/components/appointment/service.ts
    import { context } from '../../../index';

    const readFileAsync = () => {
        const p = path.join(context.appRoot, ...);
        ...
    }
    ```

    - OPTIONAL: install the async library, to test multiple requests in a single `it` block. In the repo code, this was used to test multiple DELETE requests in one block: `npm i async` and `npm i -D @types/async`

5. Run `npm run test` and watch the terminal, ensuring all tests are running as expected.

## Commit 6 - Complete code and tests for availability and user APIs

1. Following a similar structure as what was done in Commits 5 and 6, we will now complete the code and tests for availability and user services. Some things to note:

    - Use the [API Contract](./references/API-Contracts%20-%20Overview.pdf) to create the correct services for availability and user APIs:
        - For the code in this repo, /api/doctors and /api/availabilities was merged into a single /api/availabilities endpoint.
        - /api/availabilities endpoint has only GET and PUT methods:

            - GET returns a status 200 with the requested response body in json format
            - PUT returns a status 204 No Content, when the doctorId already exists (i.e. modification only). PUT returns a status 201 Created, when the doctorId does not exist, and therefore, a new availabilities object is created.
            - After completing the services for availabilities, we can import the fetchAllAvailabilities() function into the appointment/service.ts file. Using the newly fetched availabilities, we can link doctorID to doctorName in the appointment POST and PUT services, and save the modified appointment object (i.e. no longer null doctorName) back to the appointments.json file.

        - /api/users endpoints has only a POST method:

            - POST returns a 201 Created status, and returns the submitted user object, in json format. When the userName or email already exists, POST returns a 409 Conflict status.

## Commit 7 - Split test and dev environments

1. There are several ways to specify different environment variables. The approach we'll go with is in package.json, we add `SET ENV_VAR` into the scripts. For the current code, we only need `SET PORT` and `SET DATA_FOLDER` to split dev vs test environments, and folders in which to house the json data files.
    - In service.ts files, change `api` in path.join to `process.env.DATA_FOLDER`