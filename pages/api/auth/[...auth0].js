// pages/api/auth/[...auth0].js
import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';

export default handleAuth({
	login: async function(req, res) {
	
      console.log('Starting to handle login')
      return handleLogin(req, res)
      	.then(res => {
      		console.log('Redirecting to login')

      		return res
      	})
	    .catch(error => {
	      // Add you own custom error logging.
	      console.error(error)
	      res.status(error.status || 500).end(error.message)
	    
		})
	}
});