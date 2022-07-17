// services/fg-get-all.js
import fetchT from '@0441design/fetch-timed'
import {
	getAccessToken
} from './auth-api';

const redis = require("redis");

const client = redis.createClient({ url: process.env.REDIS_URL });


client.on("error", function (error) {
	console.error('fg-get-all Redis connect error');
	console.error(error);
});


function handleResponseStatusAndContentType(response) {
	const contentType = response.headers.get('content-type');
	//console.log('response contentType', contentType)

	if (response.status === 401) throw new Error('Request was not authorized.');

	if (contentType === null) return Promise.resolve(null);
	else if (contentType.startsWith('application/json;')) return response.json();
	else if (contentType.startsWith('text/plain;')) throw new Error(response.text());
	else if (contentType.startsWith('text/html;')) throw new Error(response.text());
	else throw new Error(`Unsupported response content-type: ${contentType}`);
}
export default function fgGetAll(modelName) {


	async function getAll(req, res, token) {
		const local = false
		if (token && typeof token !== 'string') throw new Error('token is not a string')
		const {
			query: {
				filter
			}
		} = req
		const qs = `?filter${filter ? '=' + filter : '[where][deleted]=false'}`
		const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.festigram.app'
		const fgUrl = apiUrl + '/api/' + modelName + qs
		//console.log('fg-get-all fgUrl', fgUrl)
		const leKey = `fg-${modelName}.${fgUrl}`

		const accessToken = ''
		//console.log('redis url', process.env.REDIS_URL)
		const t0 = Date.now()
		const subscriber = client.duplicate()
		return subscriber.connect()
			//.then(() => console.log('redis connect', Date.now() - t0))
			.then(() => subscriber.get(leKey))
			//.then((data) => console.log('redis get', Date.now() - t0) || data)
			//.then(raw => JSON.parse(raw))
			.catch(err => {
				console.error('getAll Redis Error: ' + fgUrl)
				console.error(err)
			})
			.then(data => {
				if (data) return !local && res.status(200).json(data) || data
				//console.log('Redis data not available, requesting form fg api')
				return fetchT(fgUrl, {
					headers: {
						//Authorization: `Bearer ${accessToken}`
					},
					method: 'get'
				})
					.then(handleResponseStatusAndContentType)
					.then(final => {
						//console.log('final response', fgUrl, final)
						//if(!id || !id.id) throw new Error('malformed response')
						subscriber.set(leKey, JSON.stringify(final), {
							EX: 3600 * 24
						})

						return final
					})
					.then(data => !local && res.status(200).json(data) || data)
					.catch(error => {
						console.error('fg API call error')
						console.error(error)
						if (!local) return res.status(500).send('No fg result')
						throw error;
					});
			})
			.finally(() => subscriber.quit())
	}
	return getAll
}