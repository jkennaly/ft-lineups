import { executeQuery } from '../../../../services/db'
import { get } from "../../../../services/api"
import {userProfile as festid} from "../../festigram/user"

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

const updateQuery = `UPDATE band_list
	SET(year, series) 
    VALUES(?, ?) WHERE id=? AND user=?`
const updateParams = ({year, series, id, user}) => {
	return [year, series, id, user]
}


const createQuery = `INSERT INTO 
	band_list(festival, band, user, priority) 
    VALUES(?, ?, ?, ?)`
const createParams = ({year, band, user, priority}) => {
	return [year, series, user, priority]
}

export const modify = (req, res, user, id) => {
	const validUser = user && user.id
	if(!validUser) return res.status(401).send('Invalid user')
	const query = id ? updateQuery : createQuery
	const paramObject = {
		id,
		user: festUser.id,
		band: body && body.band ? body.band : '',
		year: body && body.year ? body.year : '',
		priority: body && body.priority ? body.priority : ''

	}
	const params = id ? updateParams(paramObject) : createParams(paramObject)
	return executeQuery(query, params)
		.then(handleResponseStatusAndContentType)
		.then(models => {

			//console.log('recovered modelsdata', models)
			return models
		})
		.then(models => res.status(200).json(models))
		.catch(error => {
			console.error(error);
			return error;
			res.status(500).send('No models found')
		});
}

export default async function modelHandler(req, res) {

	const user = await festid(req, res, true)
	const {
		query: {
			id,
			name
		},
		method,
	} = req

	switch (method) {
		case 'GET':

			return executeQuery({query: 'SELECT * from `band_list` WHERE id=?', params: [id]})
				.then(models => {

					//console.log('recovered modelsdata', models[0])
					return models[0]
				})
				.then(models => res.status(200).json(models))
				.catch(error => {
					console.error(error);
					return error;
					res.status(500).send('No models found')
				});

			break
		case 'PUT':
		case 'POST':
			return modify(req, res, user, id)
			break
		default:
			res.setHeader('Allow', ['GET', 'PUT', 'POST'])
			res.status(405).end(`Method ${method} Not Allowed`)
	}
}