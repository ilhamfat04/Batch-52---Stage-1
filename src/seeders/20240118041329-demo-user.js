'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.bulkInsert('Users', [{
     name: 'John Doe',
     email: 'jhondow@mail.com',
     password: 'heheh',
     createdAt: new Date(),
     updatedAt: new Date()
   }], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
