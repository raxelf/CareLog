'use strict';

const fs = require('fs').promises;

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

    let medicines = JSON.parse(await fs.readFile('./data/medicines.json', 'utf-8'));

    medicines = medicines.map(medicine => {
      medicine.createdAt = medicine.updatedAt = new Date();
      return medicine;
    });

    await queryInterface.bulkInsert('Medicines', medicines);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Medicines', null);

  }
};
