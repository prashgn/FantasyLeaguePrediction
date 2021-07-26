function authUser(req, res, next) {
    //console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);
    if (req.user === null) {
        res.status(403);
        return res.send('You need to sign in');
    }
    next();
}

function authRole(role) {
    return async (req, res, next) => {
        if (req.user !== null) {
            try {
            } catch (error) {
                console.log(error);
            }
            if (global.gb_roles !== role && global.gb_user === req.user) {
                res.status(401);
                return res.send('Not allowed');
            }
        }
        next();
    };
}

module.exports = {
    authUser,
    authRole,
};