const db = require("../models/");
const asyncHandler = require("express-async-handler");
const User = db.User;
const { Op } = require("sequelize");
const Categories = db.Categories;
const Jobs = db.Jobs;

class CompanyServices {
  static allCompanies = asyncHandler(async (req, res) => {
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
          role: "company",
          is_verified: true,
        },
        // limit: limit,
        // offset: offset,
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
      res.status(200).send({
        status: "success",
        response: company,
      });
    } catch (e) {
      res.status(400).send({
        status: "failed",
        message: "No Company Registered yet " + e.message,
      });
    }
  });
  static searchCompany = asyncHandler(async (req, res) => {
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
          ],
        },
        where: {
          companyName: {
            [db.Sequelize.Op.like]: "%" + name + "%",
          },
          is_verified: true,
          role: "company",
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
          response: company,
        });
      } else {
        res.status(200).send({
          status: "failed",
          message: "No company found with the provided label",
        });
      }
    } catch (error) {
      res.status(500).send({
        status: "failed",
        message: "Error occurred while searching company: " + error.message,
      });
    }
  });

  static findCompanyByCategory = asyncHandler(async (req, res) => {
    const { categoryId } = req.body;
    try {
      const companies = await User.findAll({
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
          categoryId: categoryId,
          is_verified: true,
        },
      });

      if (!companies || companies.length === 0) {
        return res.status(200).json({
          status: "failed",
          message: "Company not found",
        });
      }

      let company = companies.map((instance) => instance.toJSON());
      company = company.map((companyObj) =>
        Object.fromEntries(
          Object.entries(companyObj).filter(([_, v]) => v != null)
        )
      );

      if (company.length > 0) {
        res.status(200).send({
          status: "success",
          response: company,
        });
      } else {
        res.status(200).json({
          status: "failed",
          message: "No companies found for the specified category",
        });
      }
    } catch (error) {
      res.status(500).send({
        status: "failed",
        message: "Unable to find companies: " + error.message,
      });
    }
  });
  static searchCategoryCompany = asyncHandler(async (req, res) => {
    const { categoryId, companyName } = req.body; // Add 'companyName' parameter for search

    try {
      const companies = await User.findAll({
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
          categoryId: categoryId,
          is_verified: true,
          companyName: { [Op.like]: `%${companyName}%` }, // Filter by company name
        },
      });

      if (!companies || companies.length === 0) {
        return res.status(200).json({
          status: "failed",
          message: "Company not found",
        });
      }

      let company = companies.map((instance) => instance.toJSON());
      company = company.map((companyObj) =>
        Object.fromEntries(
          Object.entries(companyObj).filter(([_, v]) => v != null)
        )
      );

      if (company.length > 0) {
        res.status(200).send({
          status: "success",
          companies: company,
        });
      } else {
        res.status(200).json({
          status: "failed",
          message: "No companies found for the specified category",
        });
      }
    } catch (error) {
      res.status(500).send({
        status: "failed",
        message: "Unable to find companies: " + error.message,
      });
    }
  });
}
module.exports = CompanyServices;
