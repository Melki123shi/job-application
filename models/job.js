const mongoose = require("mongoose");
const Joi = require("joi");

const jobSchema = new mongoose.Schema({
  id: { type: String,
    default: () => require("uuid").v4(),
    unique: true, },
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.UUID, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

const Job = mongoose.model("Job", jobSchema);

const validateJobInput = (job) => {
  const jobSchema = Joi.object({
    title: Joi.string().required().min(1).max(255),
    description: Joi.string().required().min(1),
    location: Joi.string().required().min(1).max(255),
    createdBy: Joi.string().uuid().required(),
  });

  return jobSchema.validate(job);
};

exports.Job = Job;
exports.validateJobInput = validateJobInput;