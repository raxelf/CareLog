'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Histories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      MedicalRecordId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'MedicalRecords',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
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
      QueueId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Queues',
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
    await queryInterface.dropTable('Histories');
  }
};