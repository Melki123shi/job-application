const { Job } = require("../models/job");
const Joi = require("joi");
const _ = require("lodash");
const { validateJobInput } = require("../models/job");

exports.createJob = async (req, res) => {
  try {
    console.log("firstgggggggggg")
    // Must be a company (assuming auth middleware populates req.user)
    if (!req.user || req.user.role !== "company") {
      return res.status(403).json({
        success: false,
        message: "Only companies can create jobs",
        object: null,
        errors: ["Unauthorized"],
      });
    }

    req.body.createdBy = req.user.id; 
    const body = req.body;
    const { error } = validateJobInput(body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        object: null,
        errors: error.details.map((e) => e.message),
      });
    }

    // Create a new Job instance
    const job = new Job({
      // Use _.pick to select only allowed fields from req.body
      ..._.pick(req.body, ["title", "description", "location"]),
      createdBy: req.user._id, 
    });

    console.log(job); // Log the job object for debugging

    // Save the job to the database
    await job.save();

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      object: job,
      errors: null,
    });
  } catch (err) {
    console.error('Error creating job:', err); // Log the error for debugging
    res.status(500).json({
      success: false,
      message: "Server error",
      object: null,
      errors: [err.message], // Send specific error message in development, generic in production
    });
  }
};


exports.updateJob = async (req, res) => {
  try {
    if (req.user.role !== "company") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
        object: null,
        errors: ["Only companies can update jobs"],
      });
    }

    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
        object: null,
        errors: ["Invalid job ID"],
      });
    }

    if (job.createdBy !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
        object: null,
        errors: ["You do not own this job"],
      });
    }

    const { error } = validateJobInput(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        object: null,
        errors: error.details.map((e) => e.message),
      });
    }

    job.title = req.body.title;
    job.description = req.body.description;
    job.location = req.body.location;

    await job.save();

    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      object: job,
      errors: null,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      object: null,
      errors: [err.message],
    });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    if (req.user.role !== "company") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
        object: null,
        errors: ["Only companies can delete jobs"],
      });
    }

    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
        object: null,
        errors: ["Invalid job ID"],
      });
    }

    if (job.createdBy !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
        object: null,
        errors: ["You do not own this job"],
      });
    }

    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
      object: null,
      errors: null,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      object: null,
      errors: [err.message],
    });
  }
};
