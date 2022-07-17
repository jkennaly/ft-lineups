import jwt from 'jsonwebtoken'
import jwks from 'jwks-rsa'

const client = jwks({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: process.env.NEXT_PUBLIC_JWKS_URI,
    cacheMaxAge: 24 * 60 * 60 * 1000,
})

const kidKeys = {}
const kidsInProgress = []

const getKeyFromKid = (kid) => {
    if (kidKeys[kid]) return kidKeys[kid]
    if (kidsInProgress.indexOf(kid) > -1) return
    kidsInProgress.push(kid)
    client.getSigningKey(kid).then(key => {
        //console.log('key', kid, key)
        kidKeys[kid] = key.publicKey
        kidsInProgress == kidsInProgress.filter(id => id !== kid)
        return key
    })
        .catch(err => {
            console.error('Error getting key from kid')
            console.error(err)
            kidsInProgress == kidsInProgress.filter(id => id !== kid)
        })


}

export const withApiAuthRequired = (apiPage) => (req, res, ...args) => {
    // extract and decode token from req
    try {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1]
        if (!token) throw new Error('No token found')
        const { header: { kid } } = jwt.decode(token, { complete: true })
        const key = getKeyFromKid(kid)
        if (!key) throw new Error('No key found')
        const user = jwt.verify(token,
            key,
            {
                audience: 'https://festigram.app/api/',
                issuer: 'https://festigram.app',
                algorithms: ['RS256']
            })
        req.auth = user
        return apiPage(req, res, token, ...args);
    } catch (e) {
        //console.error('Error withApiAuthRequired', e)
        if (e.message !== 'No token found' && e.message !== 'No key found') console.log(e);
        if (e.message === 'No key found') return res.status(503).setHeader('Retry-After', '5').send('Preparing')
        return res.status(401).json({
            e
        });
    }
}