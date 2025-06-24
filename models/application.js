const mongoose = require("mongoose");
const Joi = require("joi");

const applicationSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.UUID,
    default: mongoose.Types.UUID,
  },
  applicantId: {
    type: mongoose.Schema.Types.UUID,
    ref: "User",
    required: true,
  },
  jobId: {
    type: mongoose.Schema.Types.UUID,
    ref: "Job",
    required: true,
  },
  resumeLink: { type: String, required: true },
  coverLetter: { type: String },
  status: {
    type: String,
    enum: ["Applied", "Reviewed", "Interview", "Rejected", "Hired"],
    default: "Applied",
  },
  appliedAt: { type: Date, default: Date.now },
});

const Application = mongoose.model("Application", applicationSchema);

const validateApplication = (application) => {
  const applicationSchema = Joi.object({
    applicantId: Joi.string().uuid().required(),
    jobId: Joi.string().uuid().required(),
    resumeLink: Joi.string().uri().required(),
    coverLetter: Joi.string().allow("").optional(),
    status: Joi.string()
      .valid("Applied", "Reviewed", "Interview", "Rejected", "Hired")
      .default("Applied"),
  });

  return applicationSchema.validate(application);
};

exports.Application = Application;
exports.validateApplication = validateApplication;
