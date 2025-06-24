const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => require("uuid").v4(),
    unique: true,
  },
  name: {
    type: String,
    required: true,
    match: /^[a-zA-Z\s]+$/, 
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["applicant", "company"],
    required: true,
  },
});

const User = mongoose.model("User", userSchema);

const validateUserSignup = (user) => {
  const schema = Joi.object({
    name: Joi.string()
      .required()
      .pattern(/^[a-zA-Z\s]+$/)
      .message("Name must contain only alphabets and spaces"),
    email: Joi.string().required().email().message("Invalid email address"),
    password: Joi.string()
  .required()
  .pattern(
    new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}$")
  )
  .messages({
    "string.pattern.base":
      "Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one number, and one special character.",
    "string.empty": "Password is required.",
  }),

    role: Joi.string().required().valid("applicant", "company"),
  });

  return schema.validate(user);
};

exports.User = User;
exports.validateUserSignup = validateUserSignup;