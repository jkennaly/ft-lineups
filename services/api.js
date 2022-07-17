import fetchT from '@0441design/fetch-timed'
import { fetchAuth, isAuthenticated, getAccessToken } from './noauth'

async function handleResponseStatusAndContentType(response) {
  const contentType = response.headers.get('content-type');
  //console.log('response contentType', contentType)

  if (response.status === 401) throw new Error('Request was not authorized.');
  if (response.status === 503) throw new Error('Server warming up ' + response.headers.get('Retry-After'));
  if (response.status >= 400) throw new Error(await response.text())

  if (contentType === null) return Promise.resolve(null);
  else if (contentType.startsWith('application/json')) return await response.json();
  else if (contentType.startsWith('text/plain')) throw new Error(await response.text());
  else if (contentType.startsWith('text/html')) throw new Error(await response.text());
  else throw new Error(`Unsupported response content-type: ${contentType}`);
}
const origin = process.env.NEXT_PUBLIC_ORIGIN
const defaultPath = `${origin}/api/festigram/user`

const lastRequestTime = {}

export const get = async (receiver, opt = {}, retry) => {
  //if (retry) console.log('retry', opt.path)
  //console.log('defaultPath', defaultPath)
  const { path, ...fetchOptions } = opt
  const url = path || defaultPath
  try {
    if (lastRequestTime[url] > Date.now() - 1000) throw new Error('Too many requests')
    lastRequestTime[url] = Date.now()
    const response = await fetchT(
      url,
      {
        ...(await fetchAuth()),
        ...fetchOptions
      }
    )
    const handled = await handleResponseStatusAndContentType(response)
    // update the state
    receiver(handled);
    return handled
  } catch (err) {
    if (err.message.includes('Too many requests')) return null
    if (err.message.includes('Request was not authorized')) {
      //console.log('Request was not authorized', err)
      if (isAuthenticated()) {
        //try refresh token
        try {
          const token = await getAccessToken()
          //console.log('refreshed token', token)
          if (!token) localStorage.clear()
          lastRequestTime[url] = 0
          return get(receiver, opt, true)
        } catch (err) {
          //console.log('Refresh token failed', err)
          return null
        }
      }
    }
    if (err.message.includes('Server warming up')) {
      //console.log('Server warming up', err)
      if (isAuthenticated()) {
        //try refresh token
        try {
          const delay = parseInt(err.message.slice(18))
          //console.log('Server warming up', delay)
          await new Promise(resolve => setTimeout(resolve, delay))
          lastRequestTime[url] = 0
          return get(receiver, opt, true)
        } catch (err) {
          //console.log('Retry token failed', err)
          return null
        }
      }
      return get(receiver, opt, true)
    }
    console.error('API Aquire Error')
    console.error(url)
    console.error(err)
    return null
  }

};

export const post = async (receiver, opt = { body: {} }) => {
  //console.log('post opt', opt)
  const { path, body, contentType, ...fetchOptions } = opt
  const url = path || defaultPath

  const response = await fetchT(
    url,
    {
      body: body && JSON.stringify(body),
      method: 'POST',
      headers: {
        contentType
      },
      ...(await fetchAuth()),
      ...fetchOptions
    }
  ).then(handleResponseStatusAndContentType)
    .catch(err => {
      if (err.message === 'Duplicate name') return 'Duplicate name'
      console.error('API Aquire Error')
      console.error(err)
      return null
    });

  // update the state
  receiver(response);
  return response
};