import Head from 'next/head'
import EventSelector from '../../components/cards/EventSelector'
import LineupEditor from '../../components/LineupEditor'
import SubHeader from '../../components/shell/SubHeader'
import Header from '../../components/shell/Header'
import styles from '../../styles/Home.module.css'
import { currentFestival, events } from '../../services/active'
import React, { useState, useEffect } from "react";
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { fgSeries } from '../../models/lists/series'
import { fgYears } from '../../models/lists/years'
import { fgLineups } from '../../models/lists/lineups'
import { useUser } from '@auth0/nextjs-auth0'


const {getActive} = events

export default withPageAuthRequired (function Home() {
	const { user } = useUser()
	const [series, setSeries] = useState([])
	const [years, setYears] = useState([])
	const [lineups, setLineups] = useState([])
	const [selectedSeries, selectSeries] = useState()
	const [selectedYear, selectYear] = useState()

	useEffect(() => {
		const fetchSeries = async () => {
			const response = await fgSeries()

			//console.log('splash fetchSeries', response)
			if(response) setSeries(response.filter(s => !s.hiatus))
		}
		const fetchYears = async () => {
			const response = await fgYears()

			//console.log('splash fetchSeries', response)
			if(response) setYears(response)
		}
		const fetchLineups = async () => {
			const response = await fgLineups()

			//console.log('splash fetchSeries', response)
			if(response) setLineups(response)
		}
	  if(user) {
	  	fetchSeries()
	  	fetchYears()
	  	fetchLineups()
	  } 
	}, [user]);
	
	const activeLineups = (selectedYear && lineups && lineups.length ? lineups : [])
		.filter(l => l.year === selectedYear)

  return (
    <div className={styles.container}>
      <Head>
        <title>FestiGram Lineup Utility</title>
        <meta name="description" content="Scheduling festivals for fun and profit" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header active={getActive()}/>
      <SubHeader>
      	Choose a festival
      </SubHeader>

      <main className={styles.main}>
        <EventSelector 
        	series={series} 
        	years={years} 
        	selectSeries={selectSeries} 
        	selectYear={selectYear} 
      	>

      <button
        type="button"
        className="inline-flex items-center px-5 py-2 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Add a Festival
      </button>
      <button
        type="button"
        className="inline-flex items-center px-5 py-2 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Add a Festival Year
      </button>
      </EventSelector>
      {selectedYear ? <LineupEditor /> : ''}
      </main>

      <footer className={styles.footer}>
      </footer>
    </div>
  )
})
