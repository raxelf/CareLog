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

    get formattedScheduledAtDate () {
      return this.formattedScheduledAt.split('-')[0];
    }

    get formattedScheduledAtTime () {
      return this.formattedScheduledAt.split('-')[1];
    }
  }
  Queue.init({
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Status antrian tidak boleh kosong."
        },
        notEmpty: {
          args: true,
          msg: "Status antrian tidak boleh kosong."
        }
      }
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Alasan konsultasi tidak boleh kosong."
        },
        notEmpty: {
          args: true,
          msg: "Alasan konsultasi tidak boleh kosong."
        }
      }
    },
    scheduledAt: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Jadwal konsultasi tidak boleh kosong."
        },
        notEmpty: {
          args: true,
          msg: "Jadwal konsultasi tidak boleh kosong."
        },
        isNotPast(value) {
          const now = new Date();
          const selectedDate = new Date(value);

          if (selectedDate < now) {
            throw new Error("Jadwal konsultasi tidak boleh di waktu yang sudah lewat.");
          }
        }
      }
    },
    DoctorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Dokter harus dipilih."
        },
        notEmpty: {
          args: true,
          msg: "Dokter harus dipilih."
        }
      }
    },
    PatientId: DataTypes.INTEGER
  }, {
    hooks: {
      beforeValidate: (queue, options) => {
        queue.status = "Menunggu"
      }
    },
    sequelize,
    modelName: 'Queue',
  });
  return Queue;
};