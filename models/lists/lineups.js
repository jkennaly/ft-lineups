
// models/lists/festivals.js

import { get, post } from "../../services/api"


export function getLineups(id) {
	return get(() => {}, {
				path: `${origin}/api/schedgame/lineups/${id}`
			})
		.then(lineups => {
			//console.log('lineupsData', lineups)
			return lineups[0]
		})
		.catch(error => {
		  console.error('userSeries error models/lists/lineups.js')
		  console.error(error)
		  throw error
		})
}

export function yearLineups(yearId) {
	return get(() => {}, {
		path: `${origin}/api/schedgame/lineups?festival=` + yearId
	})
		.then(lineups => {
			//console.log('lineupsData', lineups)
			return lineups
		})
		.catch(error => {
		  console.error('userSeries error models/lists/lineups.js')
		  console.error(error)
		  throw error
		})
}