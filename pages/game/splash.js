import Head from 'next/head'
import Image from 'next/image'
import Profile from '../../components/Profile'
import Empty from '../../components/EmptyFestivalList'
import FestivalList from '../../components/FestivalList'
import SubHeader from '../../components/shell/SubHeader'
import Header from '../../components/shell/Header'
import styles from '../../styles/Home.module.css'
import { currentFestival, events } from '../../services/active'
import React, { useState, useEffect } from "react";
import { } from './services/noauth';
import { userSeries } from '../../models/lists/series'
import { useUser, withPageAuthRequired } from '../../services/noauth'


const { getActive } = events

export default withPageAuthRequired(function Home() {
  const { user } = useUser()
  const [festivals, userFestivals] = useState([])

  useEffect(() => {
    const fetchSeries = async () => {
      const response = await userSeries()
      //console.log('splash fetchSeries', response)
      if (response) userFestivals(response)
    }
    if (user) fetchSeries()
  }, [user]);
  return (
    <div className={styles.container}>
      <Head>
        <title>Sched Game</title>
        <meta name="description" content="Scheduling festivals for fun and profit" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header active={getActive()} />
      <SubHeader>
        My Festivals
      </SubHeader>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to Sched Game
        </h1>

        <p className={styles.description}>
          Create your own festival schedule
        </p>



        {festivals.length ? <FestivalList festivals={festivals} /> : <Empty />}
      </main>

      <footer className={styles.footer}>
      </footer>
    </div>
  )
})
