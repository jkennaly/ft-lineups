import Head from 'next/head'
import Image from 'next/image'
import Profile from '../../../components/Profile'
import Empty from '../../../components/EmptyFestivalList'
import SubHeader from '../../../components/shell/SubHeader'
import Header from '../../../components/shell/Header'
import FestivalList from '../../../components/FestivalList'
import styles from '../../../styles/Home.module.css'
import { events, createYear } from '../../../services/active'
import React, { useState, useEffect } from "react";
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { getYearUp } from '../../../models/lists/festivals'
import { useUser } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/router'
import FestivalYear from '../../../components/FestivalYear'
import { ModalPopper } from '../../../components/Modal'

const {getActive, setActive} = events

export default withPageAuthRequired (function Home() {
	const { user } = useUser()
	const [year, setYear] = useState()
	const [series, setSeries] = useState()
	const router = useRouter()
  	const id = parseInt(router.query.id, 10)
	useEffect(() => {
		const fetchYear = async () => {
			const [fetchSeries, fetchedYear] = await getYearUp(id)
			console.log('id getYear', fetchedYear)
			if(fetchedYear) {
				setActive({event: 'series', id: fetchSeries.id})
				setActive({event: 'year', id: fetchedYear.id})
				setYear(fetchedYear)	
				setSeries(fetchSeries)
			} 
		}
	  if(user) fetchYear()
	}, [user, id, getActive()]);
	const [hidden, hideModal] = useState(true)
	function closeModal(val) {
		console.log('creating year', val)
		hideModal(true)
		return createYear(val)
			.then(response => {
				console.log('created year', response)
				return response
			})
			.then(response => {
				if(response && response.insertId) {
					setActive({event: 'year', id: response.insertId})
					router.push(`/game/years/${response.insertId}`)
				}
			})
	}
	function openModal() {
		console.log('opening Modal')
		hideModal(false)
		
	}
	const [newYear, setNewYear] = useState('')
  return (
    <div className={styles.container}>
      <Head>
        <title>Sched Game</title>
        <meta name="description" content="Scheduling festivals for fun and profit" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header active={getActive()} />
      <SubHeader>
      	{series && year && `${series && series.name} ${year && year.year}`}
      </SubHeader>

      <main className="">
	      <ul role="list" className="grid grid-cols-1 gap-6 grid-cols-2">
		      <li 
		      	onClick={openModal}
		      	key={0} 
		      	className="cursor-pointer hover:bg-indigo-600 cvlc-0 min-h-10vh min-w-40vw col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200"
		      >
		      	<h3 className="text-gray-900 text-sm font-medium truncate">Copy a Lineup</h3>
	            
		      </li>
		      <li 
		      	onClick={openModal}
		      	key={1} 
		      	className="cursor-pointer hover:bg-indigo-600 cvlc-1 min-h-10vh min-w-40vw col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200"
		      >
		      	<h3 className="text-gray-900 text-sm font-medium truncate">Add Artists</h3>
		      </li>
		      <li 
		      	onClick={openModal}
		      	key={1} 
		      	className="cursor-pointer hover:bg-indigo-600 cvlc-2 min-h-10vh min-w-40vw col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200"
		      >
		      	<h3 className="text-gray-900 text-sm font-medium truncate">Remove Artists</h3>
		      </li>
	      </ul>
	      <ul role="list" className="grid grid-cols-1 gap-6 grid-cols-2">
		      <li 
		      	onClick={openModal}
		      	key={1} 
		      	className="cursor-pointer hover:bg-indigo-600 cvlc-3 min-h-10vh min-w-40vw col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200"
		      >
		      	<h3 className="text-gray-900 text-sm font-medium truncate">Add a Date</h3>
		      </li>
		      <li 
		      	onClick={openModal}
		      	key={1} 
		      	className="cursor-pointer hover:bg-indigo-600 cvlc-4 min-h-10vh min-w-40vw col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200"
		      >
		      	<h3 className="text-gray-900 text-sm font-medium truncate">Remove a Date</h3>
		      </li>
	      </ul>
        <div className="pt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
        	<div className="w-full bcoc min-w-40vw" >
        		<div className="flex items-center justify-center" ><h1 className="w-fit" >Lineup</h1></div>
        	</div>
        	<div className="w-full bcoc min-w-40vw" >
        		<div className="flex items-center justify-center" ><h1 className="w-fit" >Dates</h1></div>
        	</div>
        </div>
	      
	      
      </main>
      <ModalPopper
          	title="Add Year to Festival"
          	withSubmit={false}
          	forceClose={hidden}

          	allowOpen={() => hideModal(false)}
          	content={<FestivalYear 
          		baseObject={{series: id}} 
          		nameChange={setNewYear} 
          		save={closeModal} 
          	/>}
          	buttonHide={true}
          />

      <footer className={styles.footer}>
      </footer>
    </div>
  )
})
