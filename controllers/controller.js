const { Op, where } = require("sequelize");
const { jsPDF } = require("jspdf");
const { autoTable } = require("jspdf-autotable");
const {
  getGreetingStatus,
  getFormattedDate,
  getFormmatedDateForInputDate,
  printEmrPdf,
  printPrescriptionPdf,
} = require("../helpers/helper.js");
const {
  User,
  Profile,
  Queue,
  History,
  MedicalRecord,
  Prescription,
  PrescriptionDetails,
  Medicine,
} = require("../models/index.js");

const bcrypt = require("bcryptjs");

class Controller {
  static async getHome(req, res) {
    try {
      res.render("home");
    } catch (err) {
      console.log(err);

      res.send(err);
    }
  }

  static async getLogin(req, res) {
    try {
      let { error } = req.query;

      res.render("login", { error });
    } catch (err) {
      console.log(err);

      res.send(err);
    }
  }

  static async getRegister(req, res) {
    try {
      let { errors } = req.query;

      if (errors) errors = errors.split(",");

      res.render("register", { errors });
    } catch (err) {
      console.log(err);

      res.send(err);
    }
  }

  static async registerPatient(req, res) {
    try {
      const {
        name,
        gender,
        birthOfDate,
        address,
        phoneNumber,
        email,
        password,
      } = req.body;

      if (new Date(birthOfDate) > new Date())
        throw {
          name: "birthOfDateExceedToday",
          errors: "Tanggal lahir tidak boleh melebihi hari ini.",
        };

      const user = await User.create({ email, password });

      await Profile.create({
        name,
        gender,
        birthOfDate,
        address,
        phoneNumber,
        UserId: user.id,
      });

      res.redirect("/login");
    } catch (err) {
      if (
        err.name === "SequelizeValidationError" ||
        err.name === "SequelizeUniqueConstraintError"
      ) {
        let errors = err.errors;

        errors = errors.map((error) => {
          return error.message;
        });

        res.redirect(`/register?errors=${errors.join(",")}`);
      } else if (err.name === "birthOfDateExceedToday") {
        res.redirect(`/register?errors=${err.errors}`);
      } else {
        console.log(err);

        res.send(err);
      }
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password)
        throw {
          name: "LoginValidationError",
          error: "Email atau password harus diisi.",
        };

      let user = await User.findOne({
        where: {
          email: email,
        },
      });

      if (user) {
        const isValidPassword = bcrypt.compareSync(password, user.password);

        if (isValidPassword) {
          req.session.userId = user.id;
          req.session.role = user.role;

          if (user.role === "doctor") {
            res.redirect("/doctor");
          } else {
            res.redirect("/patient");
          }
        } else {
          throw {
            name: "LoginValidationError",
            error: "Email atau password salah.",
          };
        }
      } else {
        throw {
          name: "LoginValidationError",
          error: "Email dan password salah.",
        };
      }
    } catch (err) {
      if (err.name === "LoginValidationError") {
        res.redirect(`/login?error=${err.error}`);
      } else {
        console.log(err);

        res.send(err);
      }
    }
  }

  static async logout(req, res) {
    try {
      req.session.destroy((err) => {
        if (err) throw err;
        else {
          res.redirect("/login");
        }
      });
    } catch (err) {
      console.log(err);

      res.send(err);
    }
  }

  static async getPatientDashboard(req, res) {
    try {
      let user = await User.findByPk(req.session.userId, {
        include: [
          { model: Profile },
          {
            model: Queue,
            as: "PatientQueues",
            separate: true,
            limit: 1,
            order: [["scheduledAt", "ASC"]],
            where: {
              status: {
                [Op.eq]: "Menunggu",
              },
              scheduledAt: {
                [Op.gte]: new Date(),
              },
            },
            include: [
              {
                model: User,
                as: "Doctor",
                include: [{ model: Profile }],
              },
            ],
          },
        ],
      });

      res.render("patients/dashboard", {
        currentURL: req.originalUrl,
        user,
        getGreetingStatus,
      });
    } catch (err) {
      console.log(err);

      res.send(err);
    }
  }

  static async getPatientQueue(req, res) {
    try {
      let { errors } = req.query;

      if (errors) errors = errors.split(",");

      let user = await User.findByPk(req.session.userId, {
        include: [{ model: Profile }],
      });

      let doctors = await User.findAll({
        where: {
          role: {
            [Op.eq]: "doctor",
          },
        },
        include: [
          {
            model: Profile,
            where: {
              status: {
                [Op.eq]: "active",
              },
            },
          },
        ],
      });

      let now = getFormattedDate(new Date());
      let inputNow = getFormmatedDateForInputDate(new Date());

      res.render("patients/queue", {
        currentURL: req.originalUrl,
        user,
        doctors,
        now,
        errors,
        inputNow,
      });
    } catch (err) {
      console.log(err);

      res.send(err);
    }
  }

  static async savePatientQueue(req, res) {
    try {
      let { DoctorId, scheduledDate, scheduledTime, reason } = req.body;

      let scheduledAt;
      if (scheduledDate && scheduledTime)
        scheduledAt = new Date(scheduledDate + "T" + scheduledTime);

      let queue = await Queue.create({
        DoctorId,
        scheduledAt,
        reason,
        PatientId: req.session.userId,
      });
      await History.create({ QueueId: queue.id });

      res.redirect("/patient/history");
    } catch (err) {
      if (err.name === "SequelizeValidationError") {
        let errors = err.errors;

        errors = errors.map((error) => {
          return error.message;
        });

        res.redirect(`/patient/queue?errors=${errors.join(",")}`);
      } else {
        console.log(err);

        res.send(err);
      }
    }
  }

  static async getPatientHistory(req, res) {
    try {
      let { filter, s } = req.query;

      let histories = await History.getByPatientWithFilter(
        req.session.userId,
        filter
      );
      let historyCount = await History.findAll({
        include: [
          {
            model: Queue,
            where: {
              PatientId: req.session.userId,
            },
          },
        ],
      });
      historyCount = historyCount.length;

      res.render("patients/history", {
        currentURL: req.originalUrl,
        filter,
        histories,
        historyCount,
        s,
      });
    } catch (err) {
      console.log(err);

      res.send(err);
    }
  }

  static async getPatientEmrRequest(req, res) {
    try {
      let { id } = req.params;

      let emr = await MedicalRecord.findByPk(+id, {
        include: [
          {
            model: History,
          },
        ],
      });

      await MedicalRecord.update(
        { status: "belumdiizinkan" },
        {
          where: {
            id: +id,
          },
        }
      );

      res.redirect(`/patient/history?s=${emr.Histories[0].formmatedDate}`);
    } catch (err) {
      console.log(err);

      res.send(err);
    }
  }

  static async getDoctorDashboard(req, res) {
    try {
      let user = await User.findByPk(req.session.userId, {
        include: [{ model: Profile }],
      });

      let queue = await Queue.findAll({
        where: {
          status: "Menunggu",
        },
        include: [
          {
            model: User,
            where: {
              id: req.session.userId,
            },
            as: "Doctor",
          },
        ],
      });

      res.render("doctors/dashboard", {
        currentURL: req.originalUrl,
        user,
        getGreetingStatus,
        queue,
      });
    } catch (err) {
      console.log(err);

      res.send(err);
    }
  }

  static async getDoctorQueue(req, res) {
    try {
      let { filter } = req.query;

      let queues = await Queue.findAll({
        where: {
          DoctorId: {
            [Op.eq]: req.session.userId,
          },
          status: {
            [Op.eq]: "Menunggu",
          },
        },
        include: [
          {
            model: User,
            include: [{ model: Profile }],
            as: "Patient",
          },
        ],
      });

      res.render("doctors/queue", {
        currentURL: req.originalUrl,
        filter,
        queues,
      });
    } catch (err) {
      console.log(err);

      res.send(err);
    }
  }

  static async getDoctorQueueDiagnose(req, res) {
    try {
      let { id } = req.params;

      let queue = await Queue.findByPk(+id, {
        include: [
          {
            model: User,
            include: [{ model: Profile }],
            as: "Patient",
          },
        ],
      });

      if (!queue) throw "Antrian tidak ditemukan";

      let medicines = await Medicine.findAll();

      res.render("doctors/diagnose", {
        currentURL: req.originalUrl,
        queueId: id,
        queue,
        medicines,
      });
    } catch (err) {
      console.log(err);

      res.send(err);
    }
  }

  static async saveDoctorQueueDiagnose(req, res) {
    try {
      let { id } = req.params;
      let { anamnesis, diagnosis, medicines, doctorNotes } = req.body;

      let emr = await MedicalRecord.create({
        anamnesis,
        diagnosis,
        doctorNotes,
        DoctorId: req.session.userId,
      });

      let prescription = await Prescription.create({
        MedicalRecordId: emr.id,
      });

      for (let medicine of medicines) {
        let { id: medId, instruction, quantity } = medicine;

        await PrescriptionDetails.create({
          quantity,
          instruction,
          PrescriptionId: prescription.id,
          MedicineId: medId,
        });
      }

      await Queue.update(
        { status: "Selesai" },
        {
          where: {
            id: +id,
          },
        }
      );

      await History.update(
        {
          MedicalRecordId: emr.id,
          PrescriptionId: prescription.id,
        },
        {
          where: {
            QueueId: {
              [Op.eq]: +id,
            },
          },
        }
      );

      res.redirect("/doctor/queue");
    } catch (err) {
      console.log(err);

      res.send(err);
    }
  }

  static async getDoctorHistory(req, res) {
    try {
      let queues = await Queue.findAll({
        where: {
          DoctorId: {
            [Op.eq]: req.session.userId,
          },
          status: {
            [Op.eq]: "Selesai",
          },
        },
        include: [
          {
            model: User,
            include: [{ model: Profile }],
            as: "Patient",
          },
          {
            model: History,
            include: [
              {
                model: Prescription,
              },
              {
                model: MedicalRecord,
              },
            ],
          },
        ],
        order: [["updatedAt", "DESC"]],
      });

      res.render("doctors/history", { currentURL: req.originalUrl, queues });
    } catch (err) {
      console.log(err);

      res.send(err);
    }
  }

  static async getDoctorEmrRequest(req, res) {
    try {
      let { filter } = req.query;

      const emr = await MedicalRecord.findAll({
        where: {
          status: {
            [Op.eq]: "belumdiizinkan",
          },
          DoctorId: {
            [Op.eq]: req.session.userId,
          },
        },
        include: [
          {
            model: History,
            include: [
              {
                model: Queue,
                include: [
                  {
                    model: User,
                    as: "Patient",
                    include: [
                      {
                        model: Profile,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
        order: [["updatedAt", "ASC"]],
      });

      res.render("doctors/emrRequest", {
        currentURL: req.originalUrl,
        filter,
        emr,
      });
    } catch (err) {
      console.log(err);

      res.send(err);
    }
  }

  static async getEmrAccept(req, res) {
    try {
      let { id } = req.params;

      await MedicalRecord.update(
        { status: "diizinkan" },
        {
          where: {
            id: +id,
          },
        }
      );

      res.redirect("/doctor/emr");
    } catch (err) {
      console.log(err);

      res.send(err);
    }
  }

  static async donwloadEmrPdf(req, res) {
    try {
      const { id } = req.params;

      const medicalRecord = await MedicalRecord.findByPk(id, {
        include: [
          {
            model: History,
            include: [
              {
                model: Queue,
                include: [
                  {
                    model: User,
                    as: "Patient",
                    include: [{ model: Profile }],
                  },
                  {
                    model: User,
                    as: "Doctor",
                    include: [{ model: Profile }],
                  },
                ],
              },
              {
                model: Prescription,
                include: [
                  {
                    model: PrescriptionDetails,
                    as: "prescriptionDetails",
                    include: [
                      {
                        model: Medicine,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });

      if (!medicalRecord) throw "EMR tidak ditemukan";

      const history = medicalRecord.Histories[0];
      const queue = history.Queue;
      const patientProfile = queue.Patient.Profile;
      const doctorProfile = queue.Doctor.Profile;
      const prescriptions = history.Prescription;

      let pdfOutput = printEmrPdf(
        patientProfile,
        doctorProfile,
        prescriptions,
        medicalRecord
      );

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=rekam_medis_${patientProfile.name}.pdf`
      );
      res.send(Buffer.from(pdfOutput));
    } catch (err) {
      console.log(err);

      res.send(err);
    }
  }

  static async donwloadPrescriptionPdf(req, res) {
    try {
      const { id } = req.params;

      const medicalRecord = await MedicalRecord.findByPk(id, {
        include: [
          {
            model: History,
            include: [
              {
                model: Queue,
                include: [
                  {
                    model: User,
                    as: "Patient",
                    include: [{ model: Profile }],
                  },
                  {
                    model: User,
                    as: "Doctor",
                    include: [{ model: Profile }],
                  },
                ],
              },
              {
                model: Prescription,
                include: [
                  {
                    model: PrescriptionDetails,
                    as: "prescriptionDetails",
                    include: [
                      {
                        model: Medicine,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });

      if (!medicalRecord) throw "Resep obat tidak ditemukan";

      const history = medicalRecord.Histories[0];
      const queue = history.Queue;
      const patientProfile = queue.Patient.Profile;
      const doctorProfile = queue.Doctor.Profile;
      const prescriptions = history.Prescription;

      let pdfOutput = printPrescriptionPdf(
        patientProfile,
        doctorProfile,
        prescriptions,
        medicalRecord
      );

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=resep_obat_${patientProfile.name}.pdf`
      );
      res.send(Buffer.from(pdfOutput));
    } catch (err) {
      console.log(err);

      res.send(err);
    }
  }

  static async X(req, res) {
    try {
      res.send("x");
    } catch (err) {
      console.log(err);

      res.send(err);
    }
  }
}

module.exports = Controller;
