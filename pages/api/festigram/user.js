// pages/api/user.js
import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';

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


export default withApiAuthRequired(async function userProfile(req, res) {
  // If your Access Token is expired and you have a Refresh Token
  // `getAccessToken` will fetch you a new one using the `refresh_token` grant
  const { accessToken } = await getAccessToken(req, res, {
    scopes: ['openid', 'profile', 'email']
  });
  //console.log('Recvd access token: ', accessToken)
  const response = await fetch('https://festigram.app/api/Profiles/getUserId', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    method: 'post'
  });
  return handleResponseStatusAndContentType(response)
  .then(id => {
  	//console.log('handled response', id)
  	if(!id || !id.id) throw new Error('malformed response')
  	return id.id
  })
  .then(id => fetch('https://festigram.app/api/Profiles/' + id, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    method: 'get'
  }))
  .then(handleResponseStatusAndContentType)
  .then(user => {

  	//console.log('recovered userdata', user)
  	return user
  })
  	.then(user => res.status(200).json(user))
	.catch(error => {
	  console.error(error);
	  return error;
	  res.status(500).send('No user found')
	});
});