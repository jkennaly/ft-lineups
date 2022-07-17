
import Core from '@0441design/auth-fg-browser'


let authConfig = {}

const clean = () => {

    localStorage.removeItem("local_token")
    localStorage.removeItem("ft_user_id")
    localStorage.removeItem("ft_user_roles")
    localStorage.removeItem("ft_user_data")
    localStorage.removeItem("ft_gtt")
}

export default function setup({ authData, apiUrl }) {
    authConfig = new Core(authData, apiUrl);
}

export const withPageAuthRequired = (page) => (req, res, ...args) => {
    if (!isAuthenticated() && typeof window !== 'undefined') {
        window.location.assign('/')
        return null
    }
    return page(req, res, ...args)

}

export const getAccessToken = () => authConfig.getAccessToken && authConfig.getAccessToken()

export const fetchAuth = async () => {
    try {
        if (!authConfig.getAccessToken) throw new Error('auth not configured')
        const id = authConfig.userId()
        if (!id) throw new Error('No user id for fetchAuth')
        const token = await authConfig.getAccessToken()
        const gtt = await authConfig.getGttRaw()
        return { token, gtt }
    } catch (e) {
        return {}
    }

}

export const useUser = () => {
    try {
        const id = parseInt(localStorage.getItem("ft_user_id"), 10)
        if (!id) throw new Error('No user id')
        const userData = JSON.parse(localStorage.getItem("ft_user_data"))
        if (!userData) throw new Error('No user data')
        return { user: { id, ...userData } }
    } catch (e) {
        return { user: {} }
    }
}

export const isAuthenticated = () => {
    try {
        const id = parseInt(localStorage.getItem("ft_user_id"), 10)
        if (!id) throw new Error('No user id')
        const userData = JSON.parse(localStorage.getItem("ft_user_data"))
        if (!userData) throw new Error('No user data')
        return true
    } catch (e) {
        return false
    }
}

export const handleAuth = ({ method, token }, push) => (req, res) => {

    return {
        login: (req, res) => {
            const url = `${process.env.NEXT_PUBLIC_LOGIN_URL}?cb=${encodeURIComponent(process.env.NEXT_PUBLIC_CALLBACK_URL)}`
            clean()
            window.location.assign(url)
            return null
        },
        callback: async (req, res) => {
            try {
                //store the token
                localStorage.setItem("local_token", token)
                //get the ftUserId
                const id = await authConfig.getFtUserId()
                localStorage.setItem("ft_user_id", id)
                const roles = await authConfig.getRoles()
                localStorage.setItem("ft_user_roles", JSON.stringify(roles))
                const userData = await authConfig.getIdTokenClaims()
                localStorage.setItem("ft_user_data", JSON.stringify(userData))
                const gtt = await authConfig.getGttRawRemote()
                localStorage.setItem("ft_gtt", JSON.stringify(gtt))
                push('/lineup')
                return null
            } catch (e) {
                console.log('handleAuth callback error: ')
                console.error(e)
                push('/')
                return null
            }

        },
        logout: (req, res) => {
            clean()
            push('/')
            return null
        }

    }[method](req, res)

}


/**
 * From: https://ourcodeworld.com/articles/read/317/how-to-check-if-a-javascript-promise-has-been-fulfilled-rejected-or-resolved
 * This function allow you to modify a JS Promise by adding some status properties.
 * Based on: http://stackoverflow.com/questions/21485545/is-there-a-way-to-tell-if-an-es6-promise-is-fulfilled-rejected-resolved
 * But modified according to the specs of promises : https://promisesaplus.com/
 */
function makeQuerablePromise(promise) {
    // Don't modify any promise that has been already modified.
    if (promise.isFulfilled) return promise;

    // Set initial state
    var isPending = true;
    var isRejected = false;
    var isFulfilled = false;
    var value, reason;

    // Observe the promise, saving the fulfillment in a closure scope.
    var result = promise.then(
        function (v) {
            isFulfilled = true;
            isPending = false;
            value = v;
            return v;
        },
        function (e) {
            isRejected = true;
            isPending = false;
            reason = e;
            throw e;
        }
    );

    result.isFulfilled = function () { return isFulfilled; };
    result.isPending = function () { return isPending; };
    result.isRejected = function () { return isRejected; };
    result.value = function () { return value; };
    result.reason = function () { return reason; };
    return result;
}
