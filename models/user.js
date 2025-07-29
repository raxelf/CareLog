'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Profile, {
        foreignKey: 'UserId'
      });

      User.hasMany(models.Queue, {
        foreignKey: "PatientId",
        as: 'Patient'
      });

      User.hasMany(models.Queue, {
        foreignKey: "DoctorId",
        as: 'Doctor'
      });

      User.hasMany(models.RequestMedicalRecords, {
        foreignKey: "PatientId",
        as: 'Patient'
      });
    }
  }
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.TEXT,
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};