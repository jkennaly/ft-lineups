
// models/lists/artistPriorities.js

import { get, post } from "../../services/api"
var cache = require('js-cache')


export function fgArtistPriorities(...ids) {
	const filterObject= {
		where: {
			and: [
				{deleted: false},
				ids & ids.length ? {id: {inq: ids}} : undefined
			].filter(x => x)
		}
	}
	return get(() => {}, {
		path: `${origin}/api/festigram/artistPriorities?filter=${JSON.stringify(filterObject)}`
	})
		.then(artistPriorities => {
			//console.log('artistData', artistPriorities)
			const cached = cache.get('fg-artist-priorities')
			const cacheValid = cached && cached.length
			const newCache = [...artistPriorities, ...(cacheValid ? cache : [])]
			cache.set('fg-artist-priorities', newCache, 1000 * 60 * 60 * 24)
			return artistPriorities
		})
		.catch(error => {
		  console.error('fgLineups error models/lists/artistPriorities.js')
		  console.error(error)
		  throw error
		})
}

export async function priorityOf(id) {
	const cached = cache.get('fg-artist-priorities')
	if(cached && cached.length) {
		const ap = cached.find(a => a.id === id)
		if(ap && ap.level) return ap.level
	}
	const aps = await fgArtistPriorities()
	if(aps && aps.length) {
		const ap = aps.find(a => a.id === id)
		if(ap && ap.level) return ap.level
	}
	throw new Error('no priorityOf id ' + id)

	
}