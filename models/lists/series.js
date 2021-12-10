
// models/lists/series.js

import { get, post } from "../../services/api"

export function userSeries(schedUser) {
	return get(() => {})
		.catch(error => {
		  console.error('No festid');
		  throw error
		})
		.then(user => {
			//console.log('userSeries user', user)
			if(!user.id) throw new Error('unidentified user')
			return get(() => {}, {
				path: `${origin}/api/schedgame/series?user=` + user.id
			})
		})
		.then(series => {
			//console.log('seriesData', series)
			return series
		})
		.catch(error => {
		  console.error('userSeries error models/lists/series.js')
		  console.error(error)
		  throw error
		})
}



export function getSeries(id) {
	return get(() => {}, {
				path: `${origin}/api/schedgame/series/${id}`
			})
		.then(series => {
			//console.log('seriesData', series)
			return series[0]
		})
		.catch(error => {
		  console.error('userSeries error models/lists/series.js')
		  console.error(error)
		  throw error
		})
}

