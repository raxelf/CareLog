'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MedicalRecord extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      MedicalRecord.belongsTo(models.User, {
        foreignKey: "DoctorId",
        as: "Doctor"
      });

      MedicalRecord.belongsTo(models.Queue, {
        foreignKey: "QueueId"
      });

      MedicalRecord.hasMany(models.Prescription, {
        foreignKey: "MedicalRecordId"
      });
    }
  }
  MedicalRecord.init({
    diagnosis: DataTypes.STRING,
    DoctorId: DataTypes.INTEGER,
    QueueId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'MedicalRecord',
  });
  return MedicalRecord;
};