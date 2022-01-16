async function handleResponseStatusAndContentType(response) {
  const contentType = response.headers.get('content-type');
  //console.log('response contentType', contentType)

  if (response.status === 401) throw new Error('Request was not authorized.');
  if (response.status >= 400) throw new Error(await response.text())

  if (contentType === null) return Promise.resolve(null);
  else if (contentType.startsWith('application/json')) return await response.json();
  else if (contentType.startsWith('text/plain')) throw new Error(await response.text());
  else if (contentType.startsWith('text/html')) throw new Error(await response.text());
  else throw new Error(`Unsupported response content-type: ${contentType}`);
}
const origin = process.env.NEXT_PUBLIC_ORIGIN
const defaultPath = `${origin}/api/festigram/user`

export const get = async (receiver, opt = {}) => {
	//console.log('defaultPath', defaultPath)
  const response = await fetch(
    opt.path ? opt.path : defaultPath,
  ).then(handleResponseStatusAndContentType)
  	.catch(err => {
  		console.error('API Aquire Error')
  		console.error(opt.path ? opt.path : defaultPath)
  		console.error(err)
  		return null
  	});

  // update the state
  receiver(response);
  return response
};

export const post = async (receiver, opt = {body: {}}) => {
	//console.log('post opt', opt)

  const response = await fetch(
    opt.path ? opt.path : defaultPath,
    {
    	body: JSON.stringify(opt.body),
    	method: 'POST',
    	headers: {
	      contentType: opt.contentType ? opt.contentType : undefined
	    },
    }
  ).then(handleResponseStatusAndContentType)
  	.catch(err => {
  		if(err.message === 'Duplicate name') return 'Duplicate name'
  		console.error('API Aquire Error')
  		console.error(err)
  		return null
  	});

  // update the state
  receiver(response);
  return response
};