import React, { useEffect, useState } from "react";
import Image from 'next/image'
import ReactDOM from "react-dom";
import { get } from "../services/api"
import { useUser } from '@auth0/nextjs-auth0';



export default function Profile() {
	//console.log('Starting Profile')
  // Store list of all users
  const logged = useUser().user
const [user, setUser] = useState();// Function to collect data
	useEffect(() => {
	  if(logged) get(setUser);
	}, [logged]);
	//console.log('About to return from Profile', user)
  return (
    user && user.picture ? (
      <div>
        <Image src={user.picture} alt={user.name} height={500} width={500} />
        <h2>{user.username}</h2>
        <p>{user.email}</p>
      </div>
    ) : null
  );
}