const db = require("../models/");
const asyncHandler = require("express-async-handler");
const User = db.User;
const { Op } = require("sequelize");
const Categories = db.Categories;
const Jobs = db.Jobs;

class CustomerService {
  static allCustomers = asyncHandler(async (req, res) => {
    try {
      // const page = req.query.page ? parseInt(req.query.page, 10) : 1;
      // const limit = req.query.limit ? parseInt(req.query.limit, 10) : 5;
      // const offset = (page - 1) * limit;
      let company = await User.findAll({
        attributes: {
          exclude: [
            "password",
            "confirmPassword",
            "isAdmin",
            "createdAt",
            "updatedAt",
          ],
        },
        where: {
          role: "customer",
          is_verified: true,
        },
        // limit: limit,
        // offset: offset,
      });

      if (!company) {
        return res
          .status(200)
          .json({ status: "failed", message: "Customer not found" });
      }
      company = company.map((instance) => instance.toJSON());
      company = company.map((companyObj) =>
        Object.fromEntries(
          Object.entries(companyObj).filter(([_, v]) => v != null)
        )
      );
      res.status(200).send({
        status: "success",
        response: company,
      });
    } catch (e) {
      res.status(500).send({
        status: "failed",
        message: "No Customer Registered yet " + e.message,
      });
    }
  });
  static searchCustomer = asyncHandler(async (req, res) => {
    try {
      const { name } = req.body;
      let company = await User.findAll({
        attributes: {
          exclude: [
            "password",
            "confirmPassword",
            "isAdmin",
            "createdAt",
            "updatedAt",
            "dateOfBirth",
            "gender",
            "phoneNumber",
          ],
        },
        where: {
          firstName: {
            [db.Sequelize.Op.like]: "%" + name + "%",
          },
          is_verified: true,
          role: "customer",
        },
      });
      if (!company) {
        return res
          .status(200)
          .json({ status: "failed", message: "Company not found" });
      }
      company = company.map((instance) => instance.toJSON());
      company = company.map((companyObj) =>
        Object.fromEntries(
          Object.entries(companyObj).filter(([_, v]) => v != null)
        )
      );
      if (company.length > 0) {
        res.status(200).send({
          status: "success",
          category: company,
        });
      } else {
        res.status(200).send({
          status: "failed",
          message: "No Customer found with the provided label",
        });
      }
    } catch (error) {
      res.status(500).send({
        status: "failed",
        message: "Error occurred while searching customer: " + error.message,
      });
    }
  });
}
module.exports = CustomerService;
