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

      <main className={styles.main}>
      
	      
	      
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
