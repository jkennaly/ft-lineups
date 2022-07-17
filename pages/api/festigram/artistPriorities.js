// pages/api/festigram/artistPriorities.js

import {
	withApiAuthRequired
} from '../../../services/auth-api';

import fgAll from '../../../services/fg-get-all'



/*
client.connect()
	.catch(err => {
		console.error('Redis connect error')
		console.error(err)
	})
*/
const modelName = 'ArtistPriorities'

export default withApiAuthRequired(fgAll(modelName))