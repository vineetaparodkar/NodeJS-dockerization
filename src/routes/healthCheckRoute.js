const express = require("express");
const controller = require("../controllers/healthCheckController");

const router = express.Router();

router.get('/healthcheck', controller.serverHealthCheck);

module.exports = router;