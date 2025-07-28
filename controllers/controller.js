class Controller {
    static async getHome (req, res) {
        try {
            res.render("home");
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