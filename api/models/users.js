"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Users.init(
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      userName: DataTypes.STRING,
      dateOfBirth: DataTypes.DATE,
      gender: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      profilePhoto: DataTypes.STRING,
      companyName: DataTypes.STRING,
      description: DataTypes.TEXT,
      speciality: DataTypes.STRING,
      accraNumber: DataTypes.STRING,
      location: DataTypes.STRING,
      categoryId: DataTypes.INTEGER,
      socialMediaLink: DataTypes.STRING,
      uploadFiles: DataTypes.JSON,
      uploadPortfolio: DataTypes.JSON,
      contractor: DataTypes.STRING,
      role: DataTypes.STRING,
      isAdmin: DataTypes.BOOLEAN,
      is_verified: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Users",
    }
  );
  return Users;
};
