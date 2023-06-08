const db = require("../models/");
const asyncHandler = require("express-async-handler");
const ServiceCategory = db.Categories;
class Category {
  static addCategory = asyncHandler(async (req, res) => {
    try {
      const { label } = req.body;
      const catImage = req.file.filename;

      if (!catImage && !label) {
        throw new Error("Name and image are required");
      } else {
        const category = await ServiceCategory.create({
          label,
          image: catImage,
        });
        res.status(201).send({
          status: "success",
          message: "Category Added",
          category: category,
        });
      }
    } catch (error) {
      res.status(500).send({
        status: "failed",
        message: "Unable to Add Category: " + error.message,
      });
    }
  });
  static findCategory = asyncHandler(async (req, res) => {
    try {
      const categories = await ServiceCategory.findAll({});
      // Send the categories as a response to the client
      res.status(200).send({
        status: "success",

        category: categories,
      });
    } catch (error) {
      res.status(500).send({
        status: "failed",
        message: "Unable to find Category: " + error.message,
      });
    }
  });
  static updateCategory = asyncHandler(async (req, res) => {
    try {
      const { label } = req.body;
      const catImage = req.file.filename;
      const { id } = req.params;
      // Find the category instance with the given id
      const category = await ServiceCategory.findByPk(id);
      if (!category) {
        throw Error(`Category  not found`);
      }

      // Update the name and/or image fields
      else {
        const update = await ServiceCategory.update(
          {
            label: label,
            image: catImage.filename,
          },
          {
            where: {
              id: id,
            },
          }
        );
      }

      res.status(200).send({
        status: "success",
        message: "Category updated",
        category: category,
      });
    } catch (error) {
      res.status(500).send({
        status: "failed",
        message: "Unable to update category: " + error.message,
      });
    }
  });
  static deleteCategory = asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      const category = await ServiceCategory.findByPk(id);
      if (!category) {
        return res.status(404).send({
          status: "failed",
          message: "Category not found",
        });
      }
      const deletedCategory = await ServiceCategory.destroy({
        where: { id },
      });
      if (deletedCategory === 1) {
        res.status(200).send({
          status: "success",
          message: "Category deleted",
        });
      } else {
        res.status(400).send({
          status: "failed",
          message: "Unable to delete category",
        });
      }
    } catch (error) {
      res.status(500).send({
        status: "failed",
        message: "Unable to delete category: " + error.message,
      });
    }
  });
  static getCategoryById = asyncHandler(async (id) => {
    const category = await ServiceCategory.findByPk(id);
    return category;
  });
  static searchCategory = asyncHandler(async (req, res) => {
    try {
      const { label } = req.body;
      const categories = await ServiceCategory.findAll({
        where: {
          label: {
            [db.Sequelize.Op.like]: "%" + label + "%",
          },
        },
      });
      if (categories.length > 0) {
        res.status(200).send({
          status: "success",
          category: categories,
        });
      } else {
        res.status(404).send({
          status: "failed",
          message: "No Category found with the provided label",
        });
      }
    } catch (error) {
      res.status(500).send({
        status: "failed",
        message: "Error occurred while searching categories: " + error.message,
      });
    }
  });
  static findCompaniesByCategory = asyncHandler(async (req, res) => {
    try {
      const categoryId = req.params.categoryId;
      const companies = await User.findAll({
        where: { categoryId: categoryId },
      });
      // Send the companies as a response to the client
      res.status(200).send({
        status: "success",
        companies: companies,
      });
    } catch (error) {
      res.status(500).send({
        status: "failed",
        message: "Unable to find companies: " + error.message,
      });
    }
  });
}
module.exports = Category;
