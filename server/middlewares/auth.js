
const jwt = require('jsonwebtoken');
// ===================
// Verify token
// ===================
let verifyToken = (req,res, next) => {

    let tokenheader = req.get('Authorization');

    jwt.verify(tokenheader, process.env.TOKEN_SEED, (err, decoded)=>{

        if (err) {
            return res.status(401).json({
                ok: false,
                err
            })
        }

        req.user = decoded.user;
        next();

    });
};


// ================
// Verify Admin role
// ================

let verifyAdminRole = (req, res, next) => {
    let user = req.user;

    if (user.role === 'ADMIN_ROLE') {
        next();
        return;
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'Only admin roles can perform the action'
            }
        });
    }

    
    
}

module.exports = {
    verifyToken,
    verifyAdminRole
}