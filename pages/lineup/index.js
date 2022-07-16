import Head from 'next/head'
import EventSelector from '../../components/cards/EventSelector'
import LineupEditor from '../../components/LineupEditor'
import SubHeader from '../../components/shell/SubHeader'
import Header from '../../components/shell/Header'
import styles from '../../styles/Home.module.css'
import { currentFestival, events } from '../../services/active'
import React, { useState, useEffect } from "react";
import { fgSeries } from '../../models/lists/series'
import { fgYears } from '../../models/lists/years'
import { fgLineups } from '../../models/lists/lineups'
import { fgArtists } from '../../models/lists/artists'
import { fgArtistAliases } from '../../models/lists/artistAliases'
import { fgArtistPriorities as fgTiers } from '../../models/lists/artistPriorities'
import { useUser, withPageAuthRequired } from '../../../services/noauth'



const { getActive } = events

export default withPageAuthRequired(function Home() {
	const { user } = useUser()
	const [series, setSeries] = useState([])
	const [years, setYears] = useState([])
	const [lineups, setLineups] = useState([])
	const [tiers, setTiers] = useState([])
	const [artists, setArtists] = useState([])
	const [artistAliases, setArtistAliases] = useState([])
	const [selectedSeries, selectSeries] = useState()
	const [selectedYear, selectYear] = useState()

	useEffect(() => {
		const fetchSeries = async () => {
			const response = await fgSeries()
			if (response) setSeries(response.filter(s => !s.hiatus))
		}
		const fetchYears = async () => {
			const response = await fgYears()
			if (response) setYears(response)
		}
		const fetchLineups = async () => {
			const response = await fgLineups()
			if (response) setLineups(Object.values(response).flatMap(l => l.allArtists))
		}
		const fetchTiers = async () => {
			const response = await fgTiers()
			if (response) setTiers(response)
		}
		const fetchArtists = async () => {
			const response = await fgArtists()
			if (response) setArtists(response)
		}
		const fetchArtistAliases = async () => {
			const response = await fgArtistAliases()
			if (response) setArtistAliases(response)
		}
		if (user) {
			fetchSeries()
			fetchYears()
			fetchLineups()
			fetchTiers()
			fetchArtists()
			fetchArtistAliases()
		}
	}, [user]);
	//console.log('lineup', selectedYear)
	const year = new Date().getFullYear()
	const nextYear = year + 1
	const selectableYears = [
		{ id: year, year: `${year}` },
		{ id: nextYear, year: `${nextYear}` }
	]

	return (
		<div className={styles.container}>
			<Head>
				<title>FestiGram Lineup Utility</title>
				<meta name="description" content="Scheduling festivals for fun and profit" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Header active={getActive()} />
			<SubHeader>
				Choose a festival
			</SubHeader>

			<main className={styles.main}>

				<button
					type="button"
					className="inline-flex items-center px-5 py-2 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
				>
					Add a Festival
				</button>
				<EventSelector
					series={series}
					years={selectableYears}
					selectSeries={selectSeries}
					selectYear={selectYear}
				>
				</EventSelector>
				{selectedYear && <LineupEditor
					series={series}
					years={years}
					lineups={lineups}
					selectedSeries={selectedSeries}
					selectedYear={selectedYear}
					tiers={tiers}
					artists={artists}
					artistAliases={artistAliases}
				/>}
			</main>

			<footer className={styles.footer}>
			</footer>
		</div>
	)
})
