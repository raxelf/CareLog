const {
    User,
    Profile
} = require('../models/index.js');

const bcrypt = require('bcryptjs');

class Controller {
    static async getHome (req, res) {
        try {
            res.render("home");
        } catch (err) {
            console.log(err);

            res.send(err);
        }
    }

    static async getLogin (req, res) {
        try {
            let { error } = req.query;

            res.render("login", { error });
        } catch (err) {
            console.log(err);

            res.send(err);
        }
    }

    static async getRegister (req, res) {
        try {
            let { errors } = req.query;

            if (errors) errors = errors.split(',')

            res.render("register", { errors });
        } catch (err) {
            console.log(err);

            res.send(err);
        }
    }

    static async registerPatient (req, res) {
        try {
            const { name, gender, birthOfDate, address, phoneNumber, email, password } = req.body;

            const user = await User.create({ email, password });

            await Profile.create({
                name,
                gender,
                birthOfDate,
                address,
                phoneNumber,
                UserId: user.id
            });

            res.redirect('/login');
        } catch (err) {
            if (err.name === "SequelizeValidationError") {
                let errors = err.errors;

                errors = errors.map(error => {
                    return error.message;
                })

                res.redirect(`/register?errors=${errors.join(',')}`);
            } else {
                console.log(err);
    
                res.send(err);
            }
        }
    }

    static async login (req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) throw {
                name: "PasswordNotValid",
                error: "Email atau password harus diisi."
            }

            let user = await User.findOne({
                where: {
                    email: email
                }
            })

            if (user) {
                const isValidPassword = bcrypt.compareSync(password, user.password)

                if (isValidPassword) {
                    if (user.role === 'doctor') {
                        res.redirect('/doctor')
                    } else {
                        res.redirect('/patient')
                    }
                } else {
                    throw {
                        name: "PasswordNotValid",
                        error: "Email atau password salah."
                    }
                }
            } else {
                throw {
                    name: "PasswordNotValid",
                    error: "Email dan password salah."
                }
            }
        } catch (err) {
            if (err.name === "PasswordNotValid") {
                res.redirect(`/login?error=${err.error}`)
            } else {
                console.log(err);
    
                res.send(err);
            }
        }
    }

    static async getPatientDashboard (req, res) {
        try {
            res.render("patients/dashboard", { currentURL: req.originalUrl })
        } catch (err) {
            console.log(err);

            res.send(err);
        }
    }

    static async getPatientQueue (req, res) {
        try {
            res.render("patients/queue", { currentURL: req.originalUrl })
        } catch (err) {
            console.log(err);

            res.send(err);
        }
    }

    static async getPatientHistory (req, res) {
        try {
            let { filter } = req.query;

            res.render("patients/history", { currentURL: req.originalUrl, filter })
        } catch (err) {
            console.log(err);

            res.send(err);
        }
    }

    static async getDoctorDashboard (req, res) {
        try {
            res.render("doctors/dashboard", { currentURL: req.originalUrl })
        } catch (err) {
            console.log(err);

            res.send(err);
        }
    }

    static async getDoctorQueue (req, res) {
        try {
            let { filter } = req.query;

            res.render("doctors/queue", { currentURL: req.originalUrl, filter })
        } catch (err) {
            console.log(err);

            res.send(err);
        }
    }

    static async getDoctorHistory (req, res) {
        try {
            res.render("doctors/history", { currentURL: req.originalUrl })
        } catch (err) {
            console.log(err);

            res.send(err);
        }
    }

    static async getDoctorEmrRequest (req, res) {
        try {
            let { filter } = req.query;
            
            res.render("doctors/emrRequest", { currentURL: req.originalUrl, filter })
        } catch (err) {
            console.log(err);

            res.send(err);
        }
    }

    static async X (req, res) {
        try {
            res.send("x");
        } catch (err) {
            console.log(err);

            res.send(err);
        }
    }
}

module.exports = Controller;