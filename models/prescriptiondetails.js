'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PrescriptionDetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PrescriptionDetails.belongsTo(models.Prescription, {
        foreignKey: "PrescriptionId"
      });

      PrescriptionDetails.belongsTo(models.Medicine, {
        foreignKey: "MedicineId"
      });
    }
  }
  PrescriptionDetails.init({
    quantity: DataTypes.INTEGER,
    instruction: DataTypes.STRING,
    PrescriptionId: DataTypes.INTEGER,
    MedicineId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PrescriptionDetails',
  });
  return PrescriptionDetails;
};