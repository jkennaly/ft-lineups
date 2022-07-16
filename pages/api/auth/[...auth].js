// pages/api/auth/[...auth0].js
//import { handleAuth } from '../../../services/noauth';
import { useRouter } from 'next/router'

export default function handleAuth(options = {}) {
	return async (req, res) => {
		const router = useRouter()
		const method = router.query.auth

		return {
			login: async (req, res) => {
				const url = `${NEXT_PUBLIC_LOGIN_URL}?cb=${encodeURIComponent(NEXT_PUBLIC_CALLBACK_URL)}`
				res.writeHead(302, { Location: url })
			},
			callback: async (req, res) => {

				const token = router.query.token

				//store the token
				localStorage.setItem("local_token", token)
				//get the ftUserId
				return this.getFtUserId()
					.then(id => localStorage.setItem("ft_user_id", id))
					.then(() => this.getRoles())
					.then(roles => {
						localStorage.setItem("ft_user_roles", JSON.stringify(roles))
					})
			},

		}[method](req, res)
	}
}