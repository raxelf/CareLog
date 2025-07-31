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
        foreignKey: "PrescriptionId"
      });

      Prescription.belongsToMany(models.Medicine, {
        through: models.PrescriptionDetails,
        foreignKey: "PrescriptionId",
        otherKey: "MedicineId"
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
    sequelize,
    modelName: 'Prescription',
  });
  return Prescription;
};