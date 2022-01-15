// pages/api/festigram/series.js

import {
	withApiAuthRequired
} from '@auth0/nextjs-auth0';

import fgAll from '../../../services/fg-get-all'

const redis = require("redis");

const client = redis.createClient({url: process.env.REDIS_URL});

/*
client.connect()
	.catch(err => {
		console.error('Redis connect error')
		console.error(err)
	})
*/
const modelName = 'Lineups'

export default withApiAuthRequired(fgAll(modelName))