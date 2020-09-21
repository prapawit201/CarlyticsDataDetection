const express = require("express");
const router = express.Router();

const LoggedController = require("../controller/LoggedTestController");
const IncidentController = require("../controller/IncidentController");

router.post("/upload", LoggedController.create);
router.get("/list", LoggedController.list);

router.get("/list/incident", IncidentController.list);
router.get("/get/:incidentId", IncidentController.get);
// router.get("/listone", IncidentController.list);
module.exports = router;
