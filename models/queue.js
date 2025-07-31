'use strict';
const {
  Model
} = require('sequelize');
const { getFormattedDateTime } = require('../helpers/helper');
module.exports = (sequelize, DataTypes) => {
  class Queue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Queue.belongsTo(models.User, {
        foreignKey: 'PatientId',
        as: 'Patient'
      });

      Queue.belongsTo(models.User, {
        foreignKey: 'DoctorId',
        as: 'Doctor'
      });

      Queue.hasMany(models.History, {
        foreignKey: "QueueId"
      })
    }

    get formattedScheduledAt () {
      return getFormattedDateTime(this.scheduledAt);
    }
  }
  Queue.init({
    status: DataTypes.STRING,
    reason: DataTypes.STRING,
    scheduledAt: DataTypes.DATE,
    DoctorId: DataTypes.INTEGER,
    PatientId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Queue',
  });
  return Queue;
};