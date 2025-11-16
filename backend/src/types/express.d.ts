// we want to put res.user=user after verify jwt but typescript express.Request not have user in it so we have 2 option 
// 1) make new interface that Extend Request & put user in it but we need to put it everywhere by extend + express routes like post,get,... need Request type controller,middleware so it work if we use authRequest as Request everywhere which not good and very complex
// 2) modify Request by given way
// (so instead of add :any and make typescript useless change Request to what we need on global express by merge declaration)

declare global{
    namespace Express{
        interface Request{  // its not new declaration , it actually declaration merging where this user merge in actual express.Request interface.
            user?:any;
        }
    }
}

// for make request of express also contain user in it so we can add user when verify jwt success 
// but for put it in typescript of express globally we need given code to put in tsconfig.json
// {
//   "compilerOptions": {
//     "typeRoots": ["./node_modules/@types", "./src/types"],
//     "include": ["src/**/*.ts", "src/types/**/*.d.ts"]
//   }
// }

// express.d.ts file in types contain additional type declaration for express and it need to put in by tsconfig.json file code
// d for declaration module