const db = require("../models/");
const asyncHandler = require("express-async-handler");
const ServiceCategory = db.Category;
const User = db.User;
const moment = require("moment");
const { Op } = require("sequelize");

// const Job = db.CustomerJobs;
const Job = db.Jobs;
const Category = db.Categories;

class JobService {
  static jobCreate = asyncHandler(async (req, res) => {
    const {
      title,
      description,
      address,
      skills,
      categoryId,
      startdate,
      enddate,
      UserId,
      amount,
    } = req.body;
    if (startdate && enddate) {
      const parts = startdate.split("/");
      const partsend = enddate.split("/");
      const formattedDateStr1 = `${parts[2]}-${parts[1]}-${parts[0]}`;
      const formattedDateStr2 = `${partsend[2]}-${partsend[1]}-${partsend[0]}`;
      const timestamp1 = Date.parse(formattedDateStr1) / 1000;
      const timestamp2 = Date.parse(formattedDateStr2) / 1000;
    }
    try {
      const catergoryy = await Category.findOne({
        where: { id: categoryId },
      });

      const job = await Job.create({
        title: title,
        description: description,
        categoryId: categoryId,
        categoryName: catergoryy.label,
        address: address,
        skills: skills,
        UserId: UserId,
        // startdate: timestamp1 || "",
        // enddate: timestamp2 || "",
        amount: amount,
        type: "customer",
      });
      return true;
    } catch (error) {
      res.status(500).send({
        status: "failed",
        message: "Unable to create job: " + error.message,
      });
    }
  });
  static getCustomerJobById = asyncHandler(async (id) => {
    const customerjobs = await Job.findByPk(id, {
      include: [{ model: User, attributes: ["firstName", "lastName"] }],
    });
    if (customerjobs && customerjobs.User) {
      customerjobs.dataValues.postedBy = `${customerjobs.User.firstName} ${customerjobs.User.lastName}`;
      delete customerjobs.dataValues.User;

      const timeDifferenceInMinutes = moment().diff(
        moment(customerjobs.createdAt),
        "minutes"
      );

      customerjobs.dataValues.posted = JobService.formatTimeDifference(
        timeDifferenceInMinutes
      );
    }

    return customerjobs;
  });
  static companyJobCreate = asyncHandler(async (req, res) => {
    const {
      title,
      description,
      address,
      skills,
      categoryId,
      UserId,
      startdate,
      enddate,
      amount,
    } = req.body;
    try {
      const timestamp1 = Date.parse(startdate) / 1000;
      const timestamp2 = Date.parse(enddate) / 1000;
      const job = await Job.create({
        title: title,
        description: description,
        categoryId: categoryId,
        address: address,
        skills: skills,
        startdate: timestamp1,
        enddate: timestamp2,
        UserId: UserId,
        amount: amount,
        type: "company",
      });
      return true;
    } catch (error) {
      res.status(500).send({
        status: "failed",
        message: "Unable to create job: " + error.message,
      });
    }
  });
  static getCompanyJobById = asyncHandler(async (id) => {
    const companyJobs = await Job.findByPk(id, {
      include: [{ model: User, attributes: ["companyName"] }],
    });
    if (companyJobs && companyJobs.User) {
      companyJobs.dataValues.postedBy = `${companyJobs.User.companyName}`;
      delete companyJobs.dataValues.User;

      const timeDifferenceInMinutes = moment().diff(
        moment(companyJobs.createdAt),
        "minutes"
      );

      companyJobs.dataValues.posted = JobService.formatTimeDifference(
        timeDifferenceInMinutes
      );
    }
    // Add this line to check the fetched data
    return companyJobs;
  });
  static formatTimeDifference(diffInMinutes) {
    if (diffInMinutes < 1) return "just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 24 * 60)
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    if (diffInMinutes < 24 * 60 * 7)
      return `${Math.floor(diffInMinutes / (24 * 60))} days ago`;
    if (diffInMinutes < 24 * 60 * 30)
      return `${Math.floor(diffInMinutes / (24 * 60 * 7))} weeks ago`;
    if (diffInMinutes < 24 * 60 * 365)
      return `${Math.floor(diffInMinutes / (24 * 60 * 30))} months ago`;
    return `${Math.floor(diffInMinutes / (24 * 60 * 365))} years ago`;
  }
  static acceptOffer = asyncHandler(async (req, res) => {
    const { jobId, status } = req.body;
    try {
      const job = await Job.findOne({ where: { id: jobId } });
      if (!job) {
        return res.status(200).send({
          status: "failed",
          message: "Job not found",
        });
      }
      await job.update({ status });

      res.status(200).send({
        status: "success",
        message: "Job status updated successfully",
        response: status,
      });
    } catch (error) {
      res.status(500).send({
        status: "failed",
        message: "Unable to update job status: " + error.message,
      });
    }
  });

  static JobsObject = asyncHandler(async (req, res) => {
    try {
      const { jobIds } = req.body;

      const jobIdsArray = JSON.parse(jobIds);
      const jobsArray = Object.values(jobIdsArray);

      let jobs = [];

      const jobPromises = jobsArray.map(async (id) => {
        const job = await Job.findOne({ where: { id: id } });
        if (job) {
          jobs.push(job);
        }
      });

      await Promise.all(jobPromises);
      if (jobs.length === 0) {
        return res.status(200).send({
          status: "failed",
          message: "No jobs found",
        });
      } else {
        res.status(200).send({
          status: "success",
          message: "Jobs associated to this company.",
          response: jobs,
        });
      }
    } catch (error) {
      res.status(500).send({ status: "failed", message: error.message });
    }
  });
}
module.exports = JobService;
