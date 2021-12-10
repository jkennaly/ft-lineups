import Series from '../models/Series'
import Year from '../models/Year'

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
	return post(() => {}, {
		path: `${origin}/api/schedgame/series/`,
		body: series,
		contentType: 'application/json'
	})
}

export function createYear({year, series}) {
	const festYear = new Year({year, series})
	return post(() => {}, {
		path: `${origin}/api/schedgame/years/`,
		body: festYear,
		contentType: 'application/json'
	})
}

export function currentFestival() {
	return activeFestival.series && activeFestival
}


export const events = (function active(){

	const active = {
		series: 0,
		year: 0,
		date: 0,
		day: 0,
		"set": 0
	}
	function setActive(opt = {event: "series", id: 0}) {
		if(active[opt.event] === opt.id) return active
		active[opt.event] = opt.id
		if(['day', 'date', 'year', 'series'].includes(opt.event)) active['set'] = 0
		if(['date', 'year', 'series'].includes(opt.event)) active['day'] = 0
		if(['year', 'series'].includes(opt.event)) active['date'] = 0
		if(['series'].includes(opt.event)) active['year'] = 0
		//console.log('setting active:', opt, active)
		return active
	}

	function getActive() {
		//console.log('getting active:', active)
		return active
	}
	return {
		getActive, setActive
	}
}())