import React, { useEffect, useState } from "react";
import Image from 'next/image'
import ReactDOM from "react-dom";
import { get } from "../services/api"
import { useUser, isAuthenticated } from '../services/noauth';



export default function Profile() {
  //console.log('Starting Profile')
  // Store list of all users
  const [user, setLogged] = useState();
  useEffect(() => {
    setLogged(useUser());
  }, [isAuthenticated()]);
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