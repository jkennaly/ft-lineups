import '../styles/globals.css'

// pages/_app.js
import React from 'react';
import { UserProvider } from '@auth0/nextjs-auth0';

export default function App({ Component, pageProps }) {
	//console.log(Object.keys(pageProps))
  return (
    <UserProvider>
	    
      <Component {...pageProps} />
    </UserProvider>
  );
}