import React, { useEffect, useState } from "react";
import Image from 'next/image'
import ReactDOM from "react-dom";



export default function Profile() {
	//console.log('Starting Profile')
  // Store list of all users
const [user, setUser] = useState();// Function to collect data
const getApiData = async () => {

  const response = await fetch(
    `/api/festigram/user`,
  ).then((response) => response.json())
  	.catch(err => {
  		console.error('Profile Aquire Error')
  		console.error(err)
  		return null
  	});

  // update the state
  setUser(response);
};
	useEffect(() => {
	  getApiData();
	}, []);
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