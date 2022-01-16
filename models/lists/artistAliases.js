
// models/lists/artistAliases.js

import { get, post } from "../../services/api"



export function fgArtistAliases(...ids) {
	const filterObject= {
		where: {
			and: [
				{deleted: false},
				ids & ids.length ? {id: {inq: ids}} : undefined
			].filter(x => x)
		}
	}
	return get(() => {}, {
		path: `${origin}/api/festigram/artistAliases?filter=${JSON.stringify(filterObject)}`
	})
		.then(artistAliases => {
			//console.log('artistData', artistAliases)
			return artistAliases
		})
		.catch(error => {
		  console.error('fgLineups error models/lists/artistAliases.js')
		  console.error(error)
		  throw error
		})
}