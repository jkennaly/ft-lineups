import Series from '../models/Series'

import { get, post } from "./api"

let activeFestival = {}

const origin = process.env.NEXT_PUBLIC_ORIGIN


function useDb() {
	//returns true if the db is being used as a datastore
	//returns false if localForage is being used
}

export function Festival(data = {}) {
	if (!data.series) throw new Error('New Festival requires a name')

	//@TODO: If there is an active festival already, archive it

	this.series = data.series
	this.years = data.years ? data.years : []
	this.dates = data.dates ? data.dates : []
	this.days = data.days ? data.days : []
	this.sets = data.sets ? data.sets : []
	this.stages = data.stages ? data.stages : []
	this.locations = data.locations ? data.locations : []
	this.lineup = data.lineup ? data.lineup : []

}

export function createFestival(name) {
	const series = new Series({name})
	const activeFestival = new Festival({series})
	return post(() => {}, {
		path: `${origin}/api/schedgame/series/`,
		body: series,
		contentType: 'application/json'
	})
}

export function currentFestival() {
	return activeFestival.series && activeFestival
}