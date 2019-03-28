module.exports = {
    ensureAuthinticated: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
            // req.flash('')
            res.redirect('/users/login');
    }
}