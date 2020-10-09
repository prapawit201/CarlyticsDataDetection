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
        const rules = await Incident.findAll({
          where: {
            // incidentName: "RPM",
            incidentName: ["RPM", "Speed"],
          },
        }).then((rule) => {
          console.log("object rule : " + rule.length);
          console.log("New rules : ", JSON.parse(JSON.stringify(rule)));
          rule = JSON.parse(JSON.stringify(rule));
          return rule;
        });

        // let kc = parseFloat(req.body.kc); = RPM
        let kd = parseFloat(req.body.kd);
        let kc = parseFloat(req.body.kc);
        // let RPMint = kc;
        let SpeedInt = kd;
        let RPMInt = kc;
        let logged;
        for (let index = 0; index < rules.length; index++) {
          let rule = rules[index].incidentValue;
          // let ruleRPM = rules[index].incidentRPM;
          let ruleInt = parseFloat(rule);
          // let ruleRPMInt = parseFloat(ruleRPM);

          let incidentname = rules[index].incidentName;
          if (incidentname == "Speed") {
            console.log("1");
            if (SpeedInt > ruleInt) {
              logged = await Logged.create({
                lat: req.body.kff1006,
                long: req.body.kff1005,
                time: req.body.time,
                RPM: req.body.kc,
                Speed: req.body.kd,
              });

              // console.log("CreatedSuccess : RPM more than incident:1000");
              console.log(
                "Created Success : Speed " +
                  SpeedInt +
                  " more than incident : " +
                  ruleInt
              );
              break;
            } else if (SpeedInt < ruleInt) {
              console.log("2");
              // console.log("Error cannot Created : RPM less than incident:1000");
              console.log(
                "Created Error : Speed " +
                  SpeedInt +
                  " less than incident : " +
                  ruleInt
              );
            }
          } else if (incidentname == "RPM") {
            console.log("3");
            if (RPMInt > ruleInt) {
              console.log("4");
              //อย่าลิท create log
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

        // console.log("kd : " + SpeedInt + " : " + typeof SpeedInt);
        // console.log("rule : " + ruleInt + " : " + typeof ruleInt);
        // console.log("RPM KC : " + RPMInt + " : " + typeof RPMInt);
        // console.log("rule RPM : " + ruleRPMInt + " : " + typeof ruleRPMInt);
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
