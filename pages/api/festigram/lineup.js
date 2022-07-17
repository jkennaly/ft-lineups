// pages/api/festigram/lineup.js

import {
	getAccessToken,
	withApiAuthRequired
} from '../../../services/auth-api';

const redis = require("redis");
import fetchT from '@0441design/fetch-timed'

const client = redis.createClient({ url: process.env.REDIS_URL });

client.on("error", function (error) {
	if (error.code === 'SocketClosedUnexpectedlyError') return
	console.error('lineup Redis connect error');
	console.error(error);
});
/*
client.connect()
	.catch(err => {
		console.error('Redis connect error')
		console.error(err)
	})
*/
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.festigram.app'
const fgUrl = apiUrl + '/api/Lineups?filter[where][deleted]=false'
const leKey = `linedEvent.${fgUrl}`
function handleResponseStatusAndContentType(response) {
	if (!response) return Promise.resolve([])
	const contentType = response.headers.get('content-type');
	//console.log('response contentType', contentType)

	if (response.status === 401) throw new Error('Request was not authorized.');

	if (contentType === null) return Promise.resolve(null);
	else if (contentType.startsWith('application/json;')) return response.json();
	else if (contentType.startsWith('text/plain;')) throw new Error(response.text());
	else if (contentType.startsWith('text/html;')) throw new Error(response.text());
	else if (contentType.startsWith('application/xml')) return response.text();
	else throw new Error(`Unsupported response content-type: ${contentType}`);
}

export async function linedEvents(req, res, local) {
	// If your Access Token is expired and you have a Refresh Token
	// `getAccessToken` will fetch you a new one using the `refresh_token` grant
	//console.log('redis url', process.env.REDIS_URL)
	const t0 = Date.now()
	return client.connect()
		//.then(() => console.log('redis connect', Date.now() - t0))
		.then(() => client.get(leKey))
		//.then((data) => console.log('redis get', Date.now() - t0) || data)
		//.then(raw => JSON.parse(raw))
		.catch(err => {
			console.error('linedEvents Redis Error: ' + fgUrl)
			console.error(err)
		})
		.then(data => {
			if (data) client.quit()
			if (data) return res.status(200).json(data)
			console.log('Redis data not available, requesting form fg api')
			return fetchT(fgUrl, {
				method: 'get'
			})
				.then(handleResponseStatusAndContentType)
				.then(data => {
					console.log('lineup data', fgUrl, data)
					return data.map ? data : []
				})
				.then(lineups => {
					const festIds = lineups
						.map(x => x.festival)
						.filter((x, i, ar) => ar.indexOf(x) === i)
					const festFilter = {
						where: {
							id: {
								inq: festIds
							}
						}
					}
					const festString = JSON.stringify(festFilter)
					const festUrl = apiUrl + 'Festivals?filter=' + festString
					return fetchT(festUrl, {
						method: 'get'
					})
						.then(handleResponseStatusAndContentType)
						.then(data => {
							console.log('festivals data', fgUrl, data)
							return data.map ? data : []
						})
						.then(festivals => {
							const festData = id => festivals.find(f => f.id === id)
							const seriesIds = festivals
								.map(x => x.series)
								.filter((x, i, ar) => ar.indexOf(x) === i)
							const seriesFilter = {
								where: {
									id: {
										inq: seriesIds
									}
								}
							}
							const seriesString = JSON.stringify(seriesFilter)
							const seriesUrl = apiUrl + 'Series?filter=' + seriesString
							return fetchT(seriesUrl, {
								method: 'get'
							})
								.then(handleResponseStatusAndContentType)
								.then(data => {
									console.log('series data', fgUrl, data)
									return data.map ? data : []
								})
								.then(series => {
									const seriesData = id => series.find(f => f.id === id)
									const seriesNames = series.reduce((names, series) => {
										names[series.id] = series.name
										return names
									}, {})
									const festNames = festivals.reduce((names, fest) => {
										names[fest.id] = `${seriesNames[fest.series]} ${fest.year}`
										return names
									}, {})
									const lineupObject = lineups.reduce((obj, lineup) => {
										const fest = festNames[lineup.festival]
										if (!fest) return obj
										if (!obj[fest]) {
											const festival = festData(lineup.festival)
											const series = seriesData(festival.series)
											obj[fest] = {
												series,
												festival,
												headliners: [],
												allArtists: []
											}
										}
										obj[fest].allArtists.push(lineup)
										if (lineup.priority === 1) obj[fest].headliners.push(lineup)
										return obj
									}, {})
									return lineupObject
								})
						})
				})
				.then(final => {
					//console.log('final response', final)
					//if(!id || !id.id) throw new Error('malformed response')
					client.set(leKey, JSON.stringify(final), {
						EX: 3600 * 24
					})
						.then(() => client.quit())

					return final
				})
				.then(data => res.status(200).json(data))
				.catch(error => {
					console.error('fg API call error')
					console.error(error)

					if (!local) return res.status(500).send('No fg result')
					throw error;
				});
		})
}
export default withApiAuthRequired(linedEvents)