// pages/api/schedgame/artists.js
import {
	withApiAuthRequired,
	getSession
} from '../../../services/noauth';
import {
	executeQuery
} from '../../../services/db'
import {
	get
} from "../../../services/api"
import { userProfile as festid } from "../festigram/user"
import React, {
	useState
} from 'react'


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

const createQuery = `INSERT INTO 
	bands(name, website, fgid, user) 
    VALUES(?, ?, ?, ?)`
const createParams = ({ name, website, fgid, user }) => {
	return [name, website, fgid, user]
}

export default withApiAuthRequired(async function model(req, res) {


	const festUser = await festid(req, res, true)

	//console.log('user found:', festUser)

	const {
		query: {
			id,
			name,
			fgid
		},
		method,
	} = req
	// If your Access Token is expired and you have a Refresh Token
	// `getAccessToken` will fetch you a new one using the `refresh_token` grant


	//console.log('series req body', body.name)
	const nameText = name ? ' AND name=?' : ''
	const nameEl = name ? name : undefined
	const fgidText = fgid ? ' AND fgid=?' : ''
	const fgidEl = fgid ? fgid : undefined
	const where = nameText + fgidText
	const vals = [nameEl, fgidEl].filter(x => x)
	switch (method) {
		case 'GET':
			//console.log('get series params', vals)
			const connString = 'SELECT * FROM `bands` WHERE 1=1' + where
			//console.log('get series sql', connString, vals)
			return executeQuery({
				params: vals,
				query: connString
			})
				.then(models => {

					//console.log('recovered modelsdata', models)
					return models
				})
				.then(models => res.status(200).json(models))
				.catch(error => {
					console.error(error);
					res.status(500).send('No models found')
					return error;
				});

			break
		case 'PUT':
		case 'POST':
			//console.log('processing POST', festUser)
			const body = JSON.parse(req.body)
			const validUser = festUser && festUser.id
			if (!validUser) return res.status(401).send('Invalid user')
			const query = createQuery
			const paramObject = {
				user: festUser.id,
				name: body && body.series ? body.series : '',
				website: body && body.website ? body.website : '',
				fgid: body && body.fgid ? body.fgid : ''

			}
			const params = createParams(paramObject)
			return executeQuery({
				query,
				params
			})
				.then(([models, fields]) => {

					//console.log('recovered modelsdata', models, params)
					return models
				})
				.then(models => res.status(200).json(models))
				.catch(error => {
					console.error(error);
					const code = error.code === 'ER_DUP_ENTRY' ? 'Duplicate name' : 'No models found'
					res.status(500).send(code)
					return error;
				});
			break
		default:
			res.setHeader('Allow', ['GET', 'PUT', 'POST'])
			res.status(405).end(`Method ${method} Not Allowed`)
	}

});