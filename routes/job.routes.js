const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { createJob, updateJob, deleteJob } = require("../controllers/job.controller");

router.post("/", auth, createJob);
router.put("/:id", auth, updateJob);
router.delete("/:id", auth, deleteJob);

module.exports = router;