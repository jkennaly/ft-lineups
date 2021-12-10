
// models/lists/festivals.js

import { get, post } from "../../services/api"

import { getYear } from './years'
import { getSeries } from './series'

export function getYearUp(yearId) {
	return getYear(yearId)
		.then(y => Promise.all([getSeries(y.series), y]))
}