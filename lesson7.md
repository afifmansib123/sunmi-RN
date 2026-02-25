### Lesson 7 - react redux setup ###

The basic files for react redux are same . we will use the same configuration 
for all projects we do. if youre familiar with the setup once , building next
projects apis will be easy to build. 

I already have all the apis ready but i will be commenting them out 
to clear setup code to be seperated from actual code of apis. 

Look at code push on github history to see all codes for the pages. 

Files to create:
  src/state/api.ts
  src/state/slices/globalSlice.ts
  src/state/slices/jobsSlice.ts
  src/state/index.ts
  src/state/hooks.ts
  src/providers/ReduxProvider.tsx

--- api.ts ---
This is where ALL backend API calls are defined using RTK Query.

Live endpoints 

  POST /auth/login      → sends { username, password }
  POST /auth/logout     → clears server cookies
  GET  /user/me         → gets current user from cookie
  GET  /jobs            → job list
  GET  /jobs/:id        → job detail
  PATCH /jobs/:id/status
  POST /jobs/:id/pickup/verify
  POST /jobs/:id/pickup/confirm
  POST /jobs/:id/install/:itemId
  POST /jobs/:id/sign

Note: backend uses httpOnly cookies for auth, not Bearer tokens.
That's why we use credentials: 'include' in fetchBaseQuery.

--- globalSlice.ts ---
Stores: user, token, isAuthenticated
Actions: setCredentials, logout

--- jobsSlice.ts ---
Stores: jobs array, selectedJob
Actions: updateJobStatus, updateSerialNumber, markSnInstalled, updateJobSignOff
(This uses mock data locally)

--- index.ts ---
Combines both slices + api into one Redux store.

--- hooks.ts ---
Exports useAppDispatch and useAppSelector.
These are typed versions of Redux hooks so TypeScript knows your state shape.

--- ReduxProvider.tsx ---
Wraps the whole app in <Provider store={store}>.
Without this, no screen can access Redux.