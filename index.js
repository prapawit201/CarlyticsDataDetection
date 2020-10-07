const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
let MongoClient = require("mongodb").MongoClient;
let sequelize = require("./database/Db");
const MySQL = require("./routes/MySQL");
let Incident = require("./model/Incident");
let Logged = require("./model/LoggedTest");
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

    // app.get("/getdata", async (req, res) => {
    //   const rules = await Incident.findOne({
    //     where: {
    //       incidentName: "RPM",
    //     },
    //   }).then((rule) => {
    //     res.send("Hello World, Incident MongoToReact");
    //     return rule;
    //   });
    //   let rule = rules.incidentValue;
    //   let ruleInt = parseFloat(rule);
    //   console.log("rule 2 :" + rule + "INT : " + ruleInt);
    //   console.log(typeof ruleInt);
    //   console.log(typeof rule);
    // });

    app.post("/fetchData", async (req, res) => {
      try {
        const rules = await Incident.findOne({
          where: {
            // incidentName: "RPM",
            incidentName: "Speed",
          },
        }).then((rule) => {
          return rule;
        });
        let rule = rules.incidentValue;
        let ruleRPM = rules.incidentRPM;

        let ruleInt = parseFloat(rule);
        let ruleRPMInt = parseFloat(ruleRPM);
        // let kc = parseFloat(req.body.kc); = RPM
        let kd = parseFloat(req.body.kd);
        let kc = parseFloat(req.body.kc);
        // let RPMint = kc;
        let SpeedInt = kd;
        let RPMInt = kc;

        if (SpeedInt > ruleInt) {
          const logged = await Logged.create({
            lat: req.body.kff1006,
            long: req.body.kff1005,
            time: req.body.time,
            RPM: req.body.kc,
            Speed: req.body.kd,
          });
          // console.log("CreatedSuccess : RPM more than incident:1000");
          console.log("Created Success : Speed "+SpeedInt+" more than incident : "+ruleInt);

          // console.log(req.body);
          if (!logged) {
            res.send("error cannot create logged");
          }
        } else if (SpeedInt < ruleInt) {
          // console.log("Error cannot Created : RPM less than incident:1000");
          console.log("Created Error : Speed "+ SpeedInt +" less than incident : "+ ruleInt);
        } if (RPMInt > ruleRPMInt) {
          console.log("Created Success : RPM "+ RPMInt +" more than RPM Incident : " + ruleRPMInt);
        } else {
          console.log("Error cannot Created");
          console.log(req.body);
        }
        // console.log("kd : " + SpeedInt + " : " + typeof SpeedInt);
        // console.log("rule : " + ruleInt + " : " + typeof ruleInt);
        console.log("RPM KC : " + RPMInt + " : " + typeof RPMInt);
        console.log("rule RPM : " + ruleRPMInt + " : " + typeof ruleRPMInt);
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
