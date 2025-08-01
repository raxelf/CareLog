'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Prescription extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Prescription.belongsTo(models.MedicalRecord, {
        foreignKey: "MedicalRecordId"
      });

      Prescription.hasMany(models.PrescriptionDetails, {
        foreignKey: "PrescriptionId",
        as: "prescriptionDetails"
      });

      Prescription.belongsToMany(models.Medicine, {
        through: models.PrescriptionDetails,
        foreignKey: "PrescriptionId",
        otherKey: "MedicineId",
        as: "medicines"
      });

      Prescription.hasMany(models.History, {
        foreignKey: "PrescriptionId"
      });
    }
  }
  Prescription.init({
    prescriptionCode: DataTypes.STRING,
    MedicalRecordId: DataTypes.INTEGER
  }, {
    hooks: {
      beforeCreate: (prescription, options) => {
        if (!prescription.prescriptionCode) {
          const now = new Date();
          const yyyymmdd = now.toISOString().slice(0, 10).replace(/-/g, '');
          const time = now.toTimeString().slice(0, 8).replace(/:/g, '');
          const random = Math.floor(1000 + Math.random() * 9000);

          prescription.prescriptionCode = `RX-${yyyymmdd}${time}-${random}`;
        }
      }
    },
    sequelize,
    modelName: 'Prescription',
  });
  return Prescription;
};