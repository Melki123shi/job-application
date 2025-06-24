const express = require('express');
const connectDB = require('./config/database');

const app = express();
app.use(express.json());
require("dotenv").config();


// Start server
connectDB().then(() => {
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
  });
});

require("./config/database")();
require('./startup/routes')(app);
require('./startup/validation')();

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`listening to port: ${port}`));