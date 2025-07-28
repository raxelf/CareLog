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

      Prescription.belongsTo(models.User, {
        foreignKey: "PatientId",
        as: "Patient"
      });

      Prescription.hasMany(models.PrescriptionDetail, {
        foreignKey: "PrescriptionId"
      });
    }
  }
  Prescription.init({
    MedicalRecordId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Prescription',
  });
  return Prescription;
};