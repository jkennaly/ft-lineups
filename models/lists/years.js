
// models/lists/years.js

import { get, post } from "../../services/api"

export function seriesYears(seriesId) {
	return get(() => {}, {
		path: `${origin}/api/schedgame/years?series=` + seriesId
	})
		.then(series => {
			//console.log('seriesData', series)
			return series
		})
		.catch(error => {
		  console.error('userSeries error models/lists/years.js')
		  console.error(error)
		  throw error
		})
}



export function getYear(id) {
	return get(() => {}, {
		path: `${origin}/api/schedgame/years/${id}`
	})
		.then(series => {
			if(!series || !series[0]) throw new Error('No data recvd')
			//console.log('seriesData', series)
			return series[0]
		})
		.catch(error => {
		  console.error('userSeries error models/lists/years.js')
		  console.error(error)
		  throw error
		})
}



export function fgYears() {
	return get(() => {}, {
		path: `${origin}/api/festigram/years`
	})
		.then(series => {
			//console.log('lineupsData', lineups)
			return series
		})
		.catch(error => {
		  console.error('fgLineups error models/lists/festivals.js')
		  console.error(error)
		  throw error
		})
}
