### Lesson 9 - Navigation ###

There are multiple ways navigaton works for react native. one way is using (tabs).
however there is another approach ill be doing the navigation for ease of use. 

In the code check file -   src/navigation/AppNavigator.tsx
if you look at the page , i have imports of screeens. screens 
are like pages which we will create in next commits. for now 
this is kept empty. 

here is how we will create authenticated vs non authenticated user's navigation :

Structure:
  AppNavigator
  ├── If NOT logged in → AuthStack
  │     └── LoginScreen
  └── If logged in → MainTabs (bottom tabs)
        ├── Tab 1: JobStack (stack navigator)
        │     ├── JobListScreen    /jobs
        │     ├── JobDetailScreen  /jobs/:id
        │     ├── JobPickupScreen  /jobs/:id/pickup
        │     ├── JobInstallScreen /jobs/:id/install
        │     ├── JobSignScreen    /jobs/:id/sign
        │     └── JobSuccessScreen
        └── Tab 2: ProfileScreen

How auth routing works:
  globalSlice has isAuthenticated boolean.
  AppNavigator reads this from Redux.
  When user logs in → isAuthenticated = true → shows MainTabs.
  When user logs out → isAuthenticated = false → shows AuthStack.