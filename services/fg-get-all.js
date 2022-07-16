// services/fg-get-all.js

import {
	getAccessToken
} from './noauth';

const redis = require("redis");

const client = redis.createClient({ url: process.env.REDIS_URL });


const con = client.connect()
	.catch(err => {
		console.error('Redis connect error')
		console.error(err)
	})


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


	async function getAll(req, res, local) {

		const {
			query: {
				filter
			}
		} = req
		const qs = `?filter${filter ? '=' + filter : '[where][deleted]=false'}`
		const apiUrl = 'https://festigram.app/api/'
		const fgUrl = apiUrl + modelName + qs
		const leKey = `fg-${modelName}.${fgUrl}`

		const { accessToken } = await getAccessToken(req, res, {
			scopes: ['openid', 'profile', 'email']
		});
		// If your Access Token is expired and you have a Refresh Token
		// `getAccessToken` will fetch you a new one using the `refresh_token` grant
		//console.log('redis url', process.env.REDIS_URL)
		const t0 = Date.now()
		return con
			//.then(() => console.log('redis connect', Date.now() - t0))
			.then(() => client.get(leKey))
			//.then((data) => console.log('redis get', Date.now() - t0) || data)
			//.then(raw => JSON.parse(raw))
			.catch(err => {
				console.error('getAll Redis Error: ' + fgUrl)
				console.error(err)
			})
			.then(data => {
				if (data) return !local && res.status(200).json(data) || data
				console.log('Redis data not available, requesting form fg api')
				return fetch(fgUrl, {
					headers: {
						Authorization: `Bearer ${accessToken}`
					},
					method: 'get'
				})
					.then(handleResponseStatusAndContentType)
					.then(final => {
						//console.log('final response', final)
						//if(!id || !id.id) throw new Error('malformed response')
						client.set(leKey, JSON.stringify(final), {
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
	}
	return getAll
}