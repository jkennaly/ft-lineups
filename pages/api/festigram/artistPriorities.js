// pages/api/festigram/artistPriorities.js

import {
	withApiAuthRequired
} from '../../../services/noauth';

import fgAll from '../../../services/fg-get-all'

const redis = require("redis");

const client = redis.createClient({ url: process.env.REDIS_URL });

/*
client.connect()
	.catch(err => {
		console.error('Redis connect error')
		console.error(err)
	})
*/
const modelName = 'ArtistPriorities'

export default withApiAuthRequired(fgAll(modelName))