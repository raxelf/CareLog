'use strict';
const bcrypt = require('bcryptjs');
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
        as: 'PatientQueues'
      });

      User.hasMany(models.Queue, {
        foreignKey: "DoctorId",
        as: 'DoctorQueues'
      });
    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Email tidak boleh kosong."
        },
        notEmpty: {
          args: true,
          msg: "Email tidak boleh kosong."
        }
      }
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Password tidak boleh kosong."
        },
        notEmpty: {
          args: true,
          msg: "Password tidak boleh kosong."
        }
      }
    },
    role: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate: async (user, options) => {
        try {
          let salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
          user.role = "patient";
        } catch (err) {
          throw err;
        }
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};