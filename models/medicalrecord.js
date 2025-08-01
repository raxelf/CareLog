'use strict';
const {
  Model
} = require('sequelize');
const { getFormattedDateTime } = require('../helpers/helper');
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

      MedicalRecord.hasMany(models.Prescription, {
        foreignKey: "MedicalRecordId"
      });

      MedicalRecord.hasMany(models.History, {
        foreignKey: "MedicalRecordId"
      });
    }

    get formattedDate() {
      return getFormattedDateTime(this.updatedAt)
    }
  }
  MedicalRecord.init({
    emrCode: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Kode EMR tidak boleh kosong."
        },
        notEmpty: {
          args: true,
          msg: "Kode EMR tidak boleh kosong."
        }
      }
    },
    anamnesis: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Anamnesis tidak boleh kosong."
        },
        notEmpty: {
          args: true,
          msg: "Anamnesis tidak boleh kosong."
        }
      }
    },
    diagnosis: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Diagnosis tidak boleh kosong."
        },
        notEmpty: {
          args: true,
          msg: "Diagnosis tidak boleh kosong."
        }
      }
    },
    doctorNotes: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Catatan tidak boleh kosong."
        },
        notEmpty: {
          args: true,
          msg: "Catatan tidak boleh kosong."
        }
      }
    },
    status: DataTypes.STRING,
    DoctorId: DataTypes.INTEGER,
  }, {
    hooks: {
      beforeValidate: (medicalRecord, options) => {
        if (!medicalRecord.emrCode) {
          const now = new Date();
          const yyyymmdd = now.toISOString().slice(0, 10).replace(/-/g, '');
          const time = now.toTimeString().slice(0, 8).replace(/:/g, '');
          const random = Math.floor(1000 + Math.random() * 9000);

          medicalRecord.emrCode = `EMR-${yyyymmdd}${time}-${random}`;
        }
      }
    },
    sequelize,
    modelName: 'MedicalRecord',
  });
  return MedicalRecord;
};