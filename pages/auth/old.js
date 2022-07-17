// pages/auth/[...auth0].js

import { useRouter } from 'next/router'

export default async function handleAuth() {
    const router = useRouter()
    const method = router.query.auth

    return {
        login: async () => {
            const url = `${NEXT_PUBLIC_LOGIN_URL}?cb=${encodeURIComponent(NEXT_PUBLIC_CALLBACK_URL)}`
            window.location.assign(url)
        },
        callback: async () => {

            const token = router.query.token

            //store the token
            localStorage.setItem("local_token", token)
            //get the ftUserId
            const id = await userIdFromToken(this.apiUrl, token)
            localStorage.setItem("ft_user_id", id)
            const roles = await getRoles()
            localStorage.setItem("ft_user_roles", JSON.stringify(roles))
        }

    }[method]
}
async function getIdTokenClaims() {
    try {
        const token = await this.getAccessToken()
        const decoded = jwt_decode(token)
        return decoded
    } catch (err) {
        return {}
    }
}

async function userIdFromToken(apiUrl, authResult) {
    const localId = JSON.parse(localStorage.getItem("ft_user_id"))
    if (localId) return localId
    try {
        const timeout = 1000
        const controller = new AbortController()
        const timer = setTimeout(() => {
            return controller.abort()
        }, timeout)
        const response = await fetch(apiUrl + "/api/Profiles/getUserId/", {
            method: "post",
            cache: "no-store",
            credentials: "include",
            signal: controller.signal,
            headers: new Headers(
                authResult
                    ? Object.assign({}, headerBase, {
                        Authorization: `Bearer ${authResult}`,

                    })
                    : headerBase
            ),
        })
        clearTimeout(timer)
        const json = await response.json()
        const id = json.id
        if (!id) throw "invalid id received from getFtUserId() " + id
        if (typeof id === 'number') localStorage.setItem("ft_user_id", id)
        return id
    } catch (err) {
        console.error(err)
    }
}