const db = require("../models/");
const asyncHandler = require("express-async-handler");
const ServiceCategory = db.Category;
const User = db.User;
const jobsmilestones = db.jobsmilestones;
const JobsDetail = db.jobsdetails;
const Jobs = db.Jobs;

// const Job = db.CustomerJobs;
const Job = db.Jobs;
class JobDetailService {
  static milestonejobCreate = asyncHandler(async (req, res) => {
    const {
      mileStoneName,
      description,
      UserId,
      amount,
      dueDate,
      jobId,
      parentId,
    } = req.body;

    try {
      // If parentId is present, check if the corresponding milestone exists
      if (parentId) {
        const parentMilestone = await jobsmilestones.findOne({
          where: { id: parentId },
        });

        if (!parentMilestone) {
          return res.status(400).send({
            status: "failed",
            message: "Parent milestone not found.",
          });
        }
      }

      const milestone = await jobsmilestones.create({
        title: mileStoneName,
        description: description,
        UserId: UserId,
        amount: amount,
        dueDate: dueDate,
        jobId: jobId,
        parentId: parentId || null,
      });

      const job1 = await Jobs.findOne({
        where: { id: jobId },
      });
      if (!job1) {
        return res.status(400).send({
          status: "failed",
          message: "Job not found.",
        });
      }

      const customer = await Jobs.findOne({
        where: { UserId: job1.UserId, type: "customer" },
      });

      const company = await Jobs.findOne({
        where: { UserId: job1.UserId, type: "company" },
      });

      if (!customer || !company) {
        return res.status(400).send({
          status: "failed",
          message: "Customer or company not found.",
        });
      }

      const jobDetail = await JobsDetail.create({
        jobId: jobId,
        companyId: company.id,
        customerId: customer.id,
        milestoneId: milestone.id,
      });

      res.status(200).send({
        status: "success",
        message: parentId ? "Sub-milestone Added" : "Milestone Added",
        response: {
          milestone: milestone,
          jobDetail: jobDetail,
        },
      });
    } catch (error) {
      res.status(500).send({
        status: "failed",
        message:
          "Unable to create " +
          (parentId ? "sub-milestone" : "milestone") +
          ": " +
          error.message,
      });
    }
  });
}
module.exports = JobDetailService;
