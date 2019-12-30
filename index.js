const cron = require("node-cron");
const express = require("express");
const fs = require("fs");
const run = require("./services/app");

app = express();

const PORT = 3500;

cron.schedule("0 * * * *", function() {
  run();
});

app.listen(PORT, () => console.log(`Express server started ${PORT}`));
