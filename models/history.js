'use strict';
const {
  Model
} = require('sequelize');
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