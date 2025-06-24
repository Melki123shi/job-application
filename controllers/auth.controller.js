const { User, validateUserSignup } = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

exports.signup = async (req, res) => {
    const { error } = validateUserSignup(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        object: null,
        errors: error.details.map((err) => err.message),
      });
    }

    const { name, email, password, role } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already in use",
        object: null,
        errors: ["Email already in use"],
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await user.save();

    // Prepare response without password
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      object: userResponse,
      errors: null,
    });
};


// Login controller
exports.login = async (req, res) => {
    const { error } = validateLogin(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        object: null,
        errors: error.details.map((err) => err.message),
      });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
        object: null,
        errors: ["User not found"],
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
        object: null,
        errors: ["Incorrect password"],
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      object: {
        token,
        user: {
          id: user.id,
          role: user.role,
        },
      },
      errors: null,
    });
};

// Login validation schema
function validateLogin(data) {
  const schema = Joi.object({
    email: Joi.string().required().email().messages({
      "string.empty": "Email is required",
      "string.email": "Invalid email format",
    }),
    password: Joi.string().required().messages({
      "string.empty": "Password is required",
    }),
  });

  return schema.validate(data);
}
