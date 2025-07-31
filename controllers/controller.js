const { Op } = require('sequelize');
const { getGreetingStatus, getFormattedDate } = require('../helpers/helper.js');
const {
    User,
    Profile,
    Queue
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
            if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
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
                name: "LoginValidationError",
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
                    req.session.userId = user.id;
                    req.session.role = user.role;

                    if (user.role === 'doctor') {
                        res.redirect('/doctor')
                    } else {

                        res.redirect('/patient')
                    }
                } else {
                    throw {
                        name: "LoginValidationError",
                        error: "Email atau password salah."
                    }
                }
            } else {
                throw {
                    name: "LoginValidationError",
                    error: "Email dan password salah."
                }
            }
        } catch (err) {
            if (err.name === "LoginValidationError") {
                res.redirect(`/login?error=${err.error}`)
            } else {
                console.log(err);
    
                res.send(err);
            }
        }
    }

    static async logout (req, res) {
        try {
            req.session.destroy((err) => {
                if (err) throw err;
                else {
                    res.redirect('/login');
                }
            })
        } catch (err) {
            console.log(err);

            res.send(err);
        }
    }

    static async getPatientDashboard (req, res) {
        try {
            let user = await User.findByPk(req.session.userId, {
                include: [
                    { model: Profile },
                    {
                        model: Queue,
                        as: 'PatientQueues',
                        separate: true,
                        limit: 1,
                        where: {
                            scheduledAt: {
                                [Op.gte]: new Date()
                            }
                        },
                        include: [
                            {
                                model: User,
                                as: 'Doctor',
                                include: [{ model: Profile }]
                            }
                        ]
                    }
                ],
            });


            res.render("patients/dashboard", { currentURL: req.originalUrl, user, getGreetingStatus })
        } catch (err) {
            console.log(err);

            res.send(err);
        }
    }

    static async getPatientQueue (req, res) {
        try {
            let user = await User.findByPk(req.session.userId, {
                include: [
                    { model: Profile }
                ]
            });

            let doctors = await User.findAll(
                {
                    where: {
                        role: {
                            [Op.eq]: 'doctor'
                        }
                    },
                    include: [
                        { model: Profile }
                    ]
                }
            )

            let now = getFormattedDate(new Date());

            res.render("patients/queue", { currentURL: req.originalUrl, user, doctors, now })
        } catch (err) {
            console.log(err);

            res.send(err);
        }
    }

    static async savePatientQueue (req, res) {
        try {
            let { DoctorId, scheduledDate, scheduledTime, reason } = req.body;
            let scheduledAt = new Date(scheduledDate + "T" + scheduledTime);

            await Queue.create({ DoctorId, scheduledDate, scheduledTime, reason, PatientId:req.session.userId });

            res.redirect('/patient/history');
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