
#enviorment variables

Just a quick snippets because I tend to forget how to call enviorment variables on the frontend in NextJS.

# Create a .env in the root <small>Make sure it's ignored by the `gitignore`</small>.
```shell filename="root" copy
touch .env
```
When deploying to Netlify you can also use a `.env.local` or `.env.production` with different test keys.

For this demo i'll be using a Google Firebase example. 

# Assign variables to secret values like so

```env filename=".env" copy
  KEY=AIzaSyCR3sqaL1zGtKPMMo9_r6d7WxLH9u3m2bY
  AUTH_DOMAIN=purcasche-p.firebaseapp.com
  PROJECTID=purcasche-p
  BUCKET=570643970608
  APP_ID=1:570643970608:web:a90a71d4a7e8e170f00bf5
};
```

In the `firebase.tsx` call the variables like AO
```env filename=".env" copy
 apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  ```
  The `NEXT_PUBLIC_` is nextjs syntax and the rest is variable.
