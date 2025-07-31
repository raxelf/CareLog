'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PrescriptionDetails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      quantity: {
        type: Sequelize.INTEGER
      },
      instruction: {
        type: Sequelize.STRING
      },
      PrescriptionId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Prescriptions',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },
      MedicineId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Medicines',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('PrescriptionDetails');
  }
};