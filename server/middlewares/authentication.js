const jwt = require('jsonwebtoken');

/**
 * Verify token
 */
let verifyToken = (req, res, next) => {
    let token = req.query.token || req.get('Authorization');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token is not valid'
                }
            });
        }

        req.user = decoded.user;
        next();
    });
};

/**
 * Verify Admin Role
 */

let verifyRole = (req, res, next) => {
    let user = req.user;

    if (user.role !== 'ADMIN_ROLE') {
        return res.status(403).json({
            ok: false,
            err: {
                message: 'You are not authorized'
            }
        });
    } else {
        next();
    }

}

module.exports = {
    verifyToken,
    verifyRole
}