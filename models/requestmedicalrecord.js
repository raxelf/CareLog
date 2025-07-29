'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RequestMedicalRecord extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      RequestMedicalRecord.belongsTo(models.User, {
        foreignKey: "PatientId",
        as: "Patient"
      })

      RequestMedicalRecord.belongsTo(models.User, {
        foreignKey: "MedicalRecordId",
      })
    }
  }
  RequestMedicalRecord.init({
    MedicalRecordId: DataTypes.INTEGER,
    PatientId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'RequestMedicalRecord',
  });
  return RequestMedicalRecord;
};