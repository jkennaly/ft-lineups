// pages/api/festigram/user.js

import { withApiAuthRequired } from '../../../services/auth-api';


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

export async function userProfile(req, res, local) {
  // If your Access Token is expired and you have a Refresh Token
  // `getAccessToken` will fetch you a new one using the `refresh_token` grant
  console.log('userProfile local', req.auth)
  return res.status(200).json(req.auth || {});
  /*
  const { accessToken } = await getAccessToken(req, res, {
    scopes: ['openid', 'profile', 'email']
  });
  //console.log('local: ', local)
  //console.log('Recvd access token: ', accessToken)
  if (!accessToken && !local) return res.status(200).send('Not Looged In')
  if (!accessToken) throw new Error('Not Looged In')
  const response = await fetch('https://festigram.app/api/Profiles/getUserId', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    method: 'post'
  });
  return handleResponseStatusAndContentType(response)
    .then(id => {
      //console.log('handled response', id)
      if (!id || !id.id) throw new Error('malformed response')
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
    .then(user => !local && res.status(200).json(user) || user)
    .catch(error => {
      console.error('user.js error')
      console.error(error)
      !local && res.status(401).send('No user found')
      throw error;
    });
    */
}
export default withApiAuthRequired(userProfile)
