const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
let MongoClient = require("mongodb").MongoClient;
let sequelize = require("./database/Db");
const MySQL = require("./routes/MySQL");
let Incident = require("./model/Incident");
let Logged = require("./model/LoggedTest");
const { json } = require("body-parser");
const e = require("express");
const Car = require("./model/Car");
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// const PORT = 5678;

MongoClient.connect(
  "mongodb+srv://seniorobd2:seniorobd2@seniorproject.f0o8e.mongodb.net/test?retryWrites=true&w=majority",
  (error, client) => {
    if (error) throw error;
    var db = client.db("test");

    app.get("/", (req, res) => {
      res.send("Hello World, Carlytic MongoToReact1");
    });
    app.use(MySQL);

    app.get("/data", function (req, res, next) {
      db.collection("test5")
        .find({})
        .toArray((err, result) => {
          if (err) throw err;
          res.status(200).send(result);
        });
    });

    app.post("/fetchData", async (req, res) => {
      try {
        const cars = await Car.findAll({});
        // obd คือ ตัวที่ส่งมา detect ในเเต่ละรอบ
        let obd = req.body.eml;
        let enterpriseIdData;
        let kd = parseFloat(req.body.kd);
        let kc = parseFloat(req.body.kc);
        let SpeedInt = kd;
        let RPMInt = kc;
        let logged;
        
        for (let index = 0; index < cars.length; index++) {
          if (obd == cars[index].obdId) {
            enterpriseIdData = cars[index].enterpriseId;
            const rules = await Incident.findAll({
              where: {
                enterpriseId: enterpriseIdData,
              },
            });
            for (let index = 0; index < rules.length; index++) {
              let rule = rules[index].incidentValue;
              let ruleInt = parseFloat(rule);
              let incidentname = rules[index].incidentName;

              if (incidentname == "Speed") {
                console.log("1");
                if (SpeedInt > ruleInt) {
                  logged = await Logged.create({
                    obdId: obd,
                    lat: req.body.kff1006,
                    long: req.body.kff1005,
                    time: req.body.time,
                    RPM: req.body.kc,
                    Speed: req.body.kd,
                    IncidentType: rules[index].incidentName,
                    enterpriseId:enterpriseIdData,
                  });
    
      
                  console.log(
                    "Created Success : Speed " +
                      SpeedInt +
                      " more than Incident Speed : " +
                      ruleInt
                  );
                  break;
                } else if (SpeedInt < ruleInt) {
                  console.log("2");
          
                  console.log(
                    "Created Error : Speed " +
                      SpeedInt +
                      " less than incident : " +
                      ruleInt
                  );
                }
              }
              if (incidentname == "RPM") {
                console.log("3");
                if (RPMInt > ruleInt) {
                  console.log("4");
                  logged = await Logged.create({
                    obdId: obd,
                    lat: req.body.kff1006,
                    long: req.body.kff1005,
                    time: req.body.time,
                    RPM: req.body.kc,
                    Speed: req.body.kd,
                    EngineLoad: req.body.k4,
                    IncidentType: rules[index].incidentName,

                  });
                  console.log(
                    "Created Success : RPM " +
                      RPMInt +
                      " more than RPM Incident : " +
                      ruleInt
                  );
                  break;
                }
              } else {
                console.log("5");
                console.log("Error cannot Created");
                console.log(req.body);
              }
            }
          }
        }

        if (!logged) {
          return res.send("error cannot create logged");
        }
        res.send("ok record Logged");
      } catch (e) {
        console.log(e);
        res.send("error");
      }
    });

    const PORT = process.env.PORT || 5556;
    app.listen(PORT, () => {
      console.log("server started : " + PORT);
    });
  }
);
