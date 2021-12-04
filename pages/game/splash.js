import Head from 'next/head'
import Image from 'next/image'
import Profile from '../../components/Profile'
import Empty from '../../components/EmptyFestivalList'
import styles from '../../styles/Home.module.css'

export default function Home() {
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
        <h1 className={styles.title}>
          Welcome to Sched Game
        </h1>

        <p className={styles.description}>
          Create your own festival schedule
        </p>



        <Empty />
      </main>

      <footer className={styles.footer}>
      </footer>
    </div>
  )
}
