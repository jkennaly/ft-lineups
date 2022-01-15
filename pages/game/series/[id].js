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
import { getSeries } from '../../../models/lists/series'
import { seriesYears } from '../../../models/lists/years'
import { useUser } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/router'
import FestivalYear from '../../../components/FestivalYear'
import { ModalPopper } from '../../../components/Modal'

const {getActive, setActive} = events

export default withPageAuthRequired (function Home() {
	const { user } = useUser()
	const [festival, setFestival] = useState()
	const [years, setYears] = useState([])
	const router = useRouter()
  	const id = parseInt(router.query.id, 10)
	useEffect(() => {
		const fetchSeries = async () => {
			const response = await getSeries(id)
			//console.log('id getSeries', response)
			if(response) {
				setActive({event: 'series', id})
				setFestival(response)	
			} 
			const yearResponse = await seriesYears(id)
			if(yearResponse) {
				//console.log('yearResponse', yearResponse)
				setYears(yearResponse)	
			} 
		}
	  if(user) fetchSeries()
	}, [user, id, getActive()]);
	const [hidden, hideModal] = useState(true)
	function closeModal(val) {
		console.log('creating year', val)
		hideModal(true)
		return createYear(val)
			.then(response => {
				if(response === 'Duplicate name') throw response
				console.log('created year', response)
				return response
			})
			.catch(err => {
				if(err !== 'Duplicate name') throw err
					console.log(years)
				const switchYear = years.find(y => val.series === y.series && ('' + val.year) === y.year)
				return {insertId: switchYear.id}
			})
			.then(response => {
				if(response && response.insertId) {
					setActive({event: 'year', id: response.insertId})
					router.push(`/game/years/${response.insertId}`)
				}
			})
	}
	function openModal() {
		//console.log('opening Modal')
		//console.log('modal hidden:', hidden)
		hideModal(false)
		
	}
	function cancelModal() {
		//console.log('cancel Modal')
		hideModal(true)
		
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
      	{festival && festival.name}
      </SubHeader>

      <main className={styles.main}>
      	<div className="bcoc flex py-4 w-full justify-center items-center">
      	<span className="flex-shrink-0 inline-block px-2 py-0.5 text-green-800 font-medium bg-green-100 rounded-full">
                  Festival Years
        </span>
      	{years.map(y => <button
        type="button"
        key={y.id}
        onClick={() => router.push('/game/years/' + y.id)}
        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {y.year}
      </button>)}
      	</div>
	      {festival && <ul role="list" className="grid grid-cols-1 gap-6 grid-cols-2">
		      <li 
		      	onClick={openModal}
		      	key={0} 
		      	className="cursor-pointer hover:bg-indigo-600 cvlc-0 min-h-30vh min-w-40vw col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200"
		      >
		      	<h3 className="text-gray-900 text-sm font-medium truncate">Update the lineup</h3>
                <span className="flex-shrink-0 inline-block px-2 py-0.5 text-green-800 text-xs font-medium bg-green-100 rounded-full">
                  There are 0 artists in this festival.
                </span>
		      </li>
		      <li 
		      	onClick={openModal}
		      	key={1} 
		      	className="cursor-pointer hover:bg-indigo-600 cvlc-1 min-h-30vh min-w-40vw col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200"
		      >
		      	<h3 className="text-gray-900 text-sm font-medium truncate">Set a Date</h3>
                <span className="flex-shrink-0 inline-block px-2 py-0.5 text-green-800 text-xs font-medium bg-green-100 rounded-full">
                  This festival has no dates scheduled.
                </span>
		      </li>
		      <li 
		      	onClick={openModal}
		      	key={2} 
		      	className="cursor-pointer hover:bg-indigo-600 cvlc-2 min-h-30vh min-w-40vw col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200"
		      >
		      	<h3 className="text-gray-900 text-sm font-medium truncate">Create Stages</h3>
                <span className="flex-shrink-0 inline-block px-2 py-0.5 text-green-800 text-xs font-medium bg-green-100 rounded-full">
                  To create stages, assign a Date
                </span>
		      </li>
		      <li 
		      	onClick={openModal}
		      	key={3} 
		      	className="cursor-pointer hover:bg-indigo-600 cvlc-3 min-h-30vh min-w-40vw col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200"
		      >
		      	<h3 className="text-gray-900 text-sm font-medium truncate">Create a schedule</h3>
                <span className="flex-shrink-0 inline-block px-2 py-0.5 text-green-800 text-xs font-medium bg-green-100 rounded-full">
                  To create a schedule, assign a Date and Stages
                </span>
		      </li>
	      </ul>}
	      
      </main>
      <ModalPopper
          	title="Add Year to Festival"
          	withSubmit={false}
          	openModal={openModal}
          	closeModal={cancelModal}
          	hidden={hidden}
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
