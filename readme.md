# Commit Stages

## Commit 1 - Express generator

1. [Reference 1.1](https://expressjs.com/en/starter/generator.html)
2. `npx express-generator --view=pug myapp`
3. `npm i`

## Commit 2 - Implement TS

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
    - Create src folder. Add index.ts file in it. Refer to commit 2 for index.ts contents.
    - Run `npm start` in the root folder: /dist folder and files are generated. In the terminal, you should see "server is listening on 3000". Navigate to <http://localhost:3000> in the browser. Should see "The sedulous hyena ate the antelope" on the client-side.
  
## Commit 3 - Create folder structure as outlined in API-Folder-Structure

1. Follow structure outlined in API-Folder-Structure.md (link in lunch & learn PPT), creating necessary folders and files.

    - Since we will begin our work on the appointment API in Commit 4, we will create only the necessary controller.ts, model.ts, routes.ts, and service.ts files in the src/api/components/appointment directory, ignoring the /availability, and /user directories for now.

2. Remove generated files that will no longer be used:

    - Delete /routes, /views, /public, /bin folders and all their contents from root directory
    - We will keep the generated app.js file in the root directory for now, as reference (ex. error handler code) for later.

3. Run `npm start` in terminal of root folder, to ensure everything is still working (i.e. Navigate to <http://localhost:3000> in the browser. Should still see "The sedulous hyena ate the antelope" on the client-side)
