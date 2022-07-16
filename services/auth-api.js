import jwt from 'jsonwebtoken'
import jwks from 'jwks-rsa'


export const withApiAuthRequired = (apiPage) => (req, res, ...args) => {
    // extract and decode token from req
    try {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1]
        if (!token) throw new Error('No token found')
        const user = jwt.verify(token,
            jwks.expressJwtSecret({
                cache: true,
                rateLimit: true,
                jwksRequestsPerMinute: 5,
                jwksUri: process.env.NEXT_PUBLIC_JWKS_URI
            }),
            {
                audience: 'https://festigram.app/api/',
                issuer: 'https://festigram.app/',
                algorithms: ['RS256']
            })
        req.auth = user
        return apiPage(req, res, args);
    } catch (e) {
        if (e.message !== 'No token found') console.log(e);
        return res.status(401).json({
            error: 'Unauthorized'
        });
    }
}