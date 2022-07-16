

export default function setup({ authData, apiUrl }) {

}


export const withApiAuthRequired = (apiPage) => (req, res, ...args) => {
    return apiPage(req, res, ...args)
}

export const withPageAuthRequired = async (page) => {
    return page


}

export const getAccessToken = async (...args) => {
    return ''
}

export const useUser = () => {
    return { user: {} }
}

export const handleAuth = options => async (req, res) => {
    const query = window.location.href

    const token = query.match(/[?&]token=([^&]+).*$/)[1]

    //store the token
    localStorage.setItem("local_token", token)
    //get the ftUserId
    return this.getFtUserId()
        .then(id => localStorage.setItem("ft_user_id", id))
        .then(() => this.getRoles())
        .then(roles => {
            localStorage.setItem("ft_user_roles", JSON.stringify(roles))
        })

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