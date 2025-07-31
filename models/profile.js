'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Profile.belongsTo(models.User, {
        foreignKey: "UserId"
      });
    }
  }
  Profile.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Nama tidak boleh kosong."
        },
        notEmpty: {
          args: true,
          msg: "Nama tidak boleh kosong."
        }
      }
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Jenis Kelamin tidak boleh kosong."
        },
        notEmpty: {
          args: true,
          msg: "Jenis Kelamin tidak boleh kosong."
        }
      }
    },
    birthOfDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Tanggal Lahir tidak boleh kosong."
        },
        notEmpty: {
          args: true,
          msg: "Tanggal Lahir tidak boleh kosong."
        },
        isBeforeToday(value) {
          if (new Date(value) > new Date()) {
            throw new Error("Tanggal Lahir tidak boleh melewati hari ini.");
          }
        },
      },
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Alamat tidak boleh kosong."
        },
        notEmpty: {
          args: true,
          msg: "Alamat tidak boleh kosong."
        }
      }
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "No. Handphone tidak boleh kosong."
        },
        notEmpty: {
          args: true,
          msg: "No. Handphone tidak boleh kosong."
        }
      }
    },
    specialization: DataTypes.STRING,
    status: DataTypes.STRING,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};