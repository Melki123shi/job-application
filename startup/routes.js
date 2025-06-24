const express = require("express");
const error = require("../middleware/error");
const auth = require("../routes/auth.routes");
const job = require("../routes/job.routes");


module.exports = function (app) {
    app.use(express.json());
    app.use("/api/auth", auth);
    app.use("/api/job", job);
    app.use(error);
}