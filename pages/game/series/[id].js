import Head from 'next/head'
import Image from 'next/image'
import Profile from '../../../components/Profile'
import Empty from '../../../components/EmptyFestivalList'
import FestivalList from '../../../components/FestivalList'
import styles from '../../../styles/Home.module.css'
import { currentFestival } from '../../../services/active'
import React, { useState, useEffect } from "react";
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { getSeries } from '../../../models/lists/series'
import { useUser } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/router'


export default withPageAuthRequired (function Home() {
	const { user } = useUser()
	const [festival, setFestival] = useState()
	const router = useRouter()
  	const { id } = router.query
	useEffect(() => {
		const fetchSeries = async () => {
			const response = await getSeries(id)
			//console.log('splash fetchSeries', response)
			if(response) setFestival(response)
		}
	  if(user) fetchSeries()
	}, [user]);
  return (
    <div className={styles.container}>
      <Head>
        <title>Sched Game</title>
        <meta name="description" content="Scheduling festivals for fun and profit" />
        <link rel="icon" href="/favicon.ico" />
        <Profile />
        <a href="/api/auth/login">Login</a>

        <a href="/api/auth/logout">Logout</a>
      </Head>

      <main className={styles.main}>
      
	      {festival && <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
		      <li key={0} className="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200">
		      	<h3 className="text-gray-900 text-sm font-medium truncate">Update the lineup</h3>
                <span className="flex-shrink-0 inline-block px-2 py-0.5 text-green-800 text-xs font-medium bg-green-100 rounded-full">
                  There are 0 artists in this festival.
                </span>
		      </li>
		      <li key={1} className="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200">
		      	<h3 className="text-gray-900 text-sm font-medium truncate">Set a Date</h3>
                <span className="flex-shrink-0 inline-block px-2 py-0.5 text-green-800 text-xs font-medium bg-green-100 rounded-full">
                  This festival has no dates scheduled.
                </span>
		      </li>
		      <li key={2} className="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200">
		      	<h3 className="text-gray-900 text-sm font-medium truncate">Create Stages</h3>
                <span className="flex-shrink-0 inline-block px-2 py-0.5 text-green-800 text-xs font-medium bg-green-100 rounded-full">
                  To create stages, assign a Date
                </span>
		      </li>
		      <li key={3} className="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200">
		      	<h3 className="text-gray-900 text-sm font-medium truncate">Create a schedule</h3>
                <span className="flex-shrink-0 inline-block px-2 py-0.5 text-green-800 text-xs font-medium bg-green-100 rounded-full">
                  To create a schedule, assign a Date and Stages
                </span>
		      </li>
	      </ul>}
	      
      </main>

      <footer className={styles.footer}>
      </footer>
    </div>
  )
})
