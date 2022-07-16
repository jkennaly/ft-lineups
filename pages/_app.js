import '../styles/globals.css'

//import setup from './services/noauth'

// pages/_app.js
import React from 'react';
//import { UserProvider } from './services/noauth';

const authData = {
  "CALLBACKURL": "http://localhost:8181/#!/callback",
  "LOGINURL": "http://localhost:8080/authorize/login",
  "AUDIENCE": "https://festigram.app/api/'",
  "RESPONSETYPE": "token",
  "SCOPE": "openid profile email",
  "SCHEME": "local"
}
const apiUrl = "http://localhost:8080"
//const AuthClass = authData.SCHEME === 'local' ? new AuthLocal() : new Auth0()
try {

  //setup({ authData, apiUrl })
} catch (err) {
  console.error('Auth Setup failed')
  console.error(err)
}


export default function App({ Component, pageProps }) {
  //console.log(Object.keys(pageProps))
  return (

    <Component {...pageProps} />
  );
}