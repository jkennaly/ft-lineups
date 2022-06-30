
import { get, post } from "../../services/api"


export function arachProcessed(lineupUrl) {
	const qs = `lineupUrl=${lineupUrl}`
	const url = `${process.env.NEXT_PUBLIC_ARACH_API_URL}${qs}`
	return get(() => { }, {
		path: url
	})
		.then(series => {
			//console.log('arach processed data', url, series)
			return series
		})
		.catch(error => {
			console.error('fgLineups error models/lists/extracts.js')
			console.error(error)
			throw error
		})
}