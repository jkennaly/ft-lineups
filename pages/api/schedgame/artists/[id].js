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

const updateQuery = `UPDATE bands
	SET(name, website, fgid) 
    VALUES(?, ?, ?) WHERE id=? AND user=?`
const updateParams = ({name, website, fgid, id, user}) => {
	return [name, website, fgid, id, user]
}

const createQuery = `INSERT INTO 
	bands(name, website, fgid, user) 
    VALUES(?, ?, ?, ?)`
const createParams = ({name, website, fgid, user}) => {
	return [name, website, fgid, user]
}

export const modify = (req, res, user, id) => {
	const validUser = user && user.id
	if(!validUser) return res.status(401).send('Invalid user')
	const query = id ? updateQuery : createQuery
	const paramObject = {
		id,
		user: user.id,
		name: req && req.body && req.body.name ? req.body.name : '',
		website: req && req.body && req.body.website ? req.body.website : '',
		fgid: req && req.body && req.body.fgid ? req.body.fgid : undefined

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
			name,
			fgid
		},
		method,
	} = req

	switch (method) {
		case 'GET':

			return executeQuery({query: 'SELECT * from `festivals` WHERE id=? OR name=? OR fgid=?', params: [id, name, fgid]})
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