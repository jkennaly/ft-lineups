
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
			//console.log('seriesData', series)
			return series[0]
		})
		.catch(error => {
		  console.error('userSeries error models/lists/years.js')
		  console.error(error)
		  throw error
		})
}

