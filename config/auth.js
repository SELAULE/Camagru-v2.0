module.exports = {
    ensureAuthinticated: function (req, res, next) {
        if (req.isAuthenticated) {
            return next();
        } else {
            // req.flash('')
            res.redirect('/users/login');
        }
    }
}