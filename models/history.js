'use strict';
const {
  Model,
  Op
} = require('sequelize');
const { getFormattedDateTime } = require('../helpers/helper');
module.exports = (sequelize, DataTypes) => {
  class History extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      History.belongsTo(models.Queue, {
        foreignKey: "QueueId"
      })

      History.belongsTo(models.MedicalRecord, {
        foreignKey: "MedicalRecordId"
      })

      History.belongsTo(models.Prescription, {
        foreignKey: "PrescriptionId"
      })
    }

    get formmatedDate() {
      return getFormattedDateTime(this.updatedAt).split('-')[0];
    }

    static async getByPatientWithFilter(patientId, filter) {
      try {
        let options =
        {
          include: [
            {
                model: sequelize.models.Queue,
                where: {
                    PatientId: patientId
                },
                include: [
                    {
                        model: sequelize.models.User,
                        where: {
                            role: {
                                [Op.eq]: 'doctor'
                            }
                        },
                        as: 'Doctor',
                        include: [{ model: sequelize.models.Profile }],
                    }
                ]
            },
            {
                model: sequelize.models.MedicalRecord
            },
            {
                model: sequelize.models.Prescription
            }
          ],
          order: [[sequelize.models.Queue, 'scheduledAt', 'ASC'], [sequelize.models.Queue, 'createdAt', 'DESC']]
        };

        if (filter) options.include[0].where.status = {
            [Op.eq]: filter
        }

        let histories = await History.findAll(options);

        return histories;
      } catch (err) {
        throw err;
      }
    }
  }
  History.init({
    MedicalRecordId: DataTypes.INTEGER,
    PrescriptionId: DataTypes.INTEGER,
    QueueId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'History',
  });
  return History;
};