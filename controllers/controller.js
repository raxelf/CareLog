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
            res.render("login");
        } catch (err) {
            console.log(err);

            res.send(err);
        }
    }

    static async getRegister (req, res) {
        try {
            res.render("register");
        } catch (err) {
            console.log(err);

            res.send(err);
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