"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Users", "categoryId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "Categories",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Users", "categoryId");
  },
};
