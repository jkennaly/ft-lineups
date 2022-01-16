
// models/lists/artists.js

import { get, post } from "../../services/api"



export function fgArtists(...ids) {
	const filterObject= {
		where: {
			and: [
				{deleted: false},
				ids & ids.length ? {id: {inq: ids}} : undefined
			].filter(x => x)
		}
	}
	return get(() => {}, {
		path: `${origin}/api/festigram/artists?filter=${JSON.stringify(filterObject)}`
	})
		.then(artists => {
			//console.log('artistData', artists)
			return artists
		})
		.catch(error => {
		  console.error('fgLineups error models/lists/artists.js')
		  console.error(error)
		  throw error
		})
}