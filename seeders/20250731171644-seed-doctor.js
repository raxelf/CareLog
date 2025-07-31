'use strict';

const fs = require('fs').promises;
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    let doctors = JSON.parse(await fs.readFile('./data/doctors.json', 'utf-8'));
    doctors = doctors.map(doctor => {
      delete doctor.id;
      doctor.createdAt = doctor.updatedAt = new Date();
      return doctor;
    })

    let doctorAccounts = doctors.map(doctor => {
      const salt = bcrypt.genSaltSync(10);
      doctor.password = bcrypt.hashSync(doctor.password, salt);

      return {
        email: doctor.email,
        password: doctor.password,
        role: doctor.role,
        createdAt: doctor.createdAt,
        updatedAt: doctor.updatedAt,
      }
    });

    let doctorProfiles = doctors.map(doctor => {
      delete doctor.email;
      delete doctor.password;
      delete doctor.role;

      return doctor;
    });

    await queryInterface.bulkInsert("Users", doctorAccounts)
    await queryInterface.bulkInsert("Profiles", doctorProfiles)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.bulkDelete('Profiles', null, {});
  }
};
