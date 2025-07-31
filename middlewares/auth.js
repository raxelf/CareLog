const isLoggedIn = function(req, res, next) {
    if(!req.session.userId && !req.session.role) {
        const error = "Akses ditolak. Silakan login terlebih dahulu";

        res.redirect(`/login?error=${error}`)
    } else {
        next();
    }
}

const isPatient = function(req, res, next) {
    if (req.session.role === 'patient') {
        next();
    } else {
        res.redirect('/doctor')
    }
}

const isDoctor = function(req, res, next) {
    if (req.session.role === 'doctor') {
        next();
    } else {
        res.redirect('/patient')
    }
}

const notLoggedIn = function (req, res, next) {
    if(!req.session.userId && !req.session.role) {
        next();
    } else {
        if (req.session.role === 'patient') {
            res.redirect('/patient');
        } else if (req.session.role === 'doctor') {
            res.redirect('/doctor');
        }
    }
}

module.exports = {
    isLoggedIn,
    isDoctor,
    isPatient,
    notLoggedIn
}