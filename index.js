const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
let MongoClient = require("mongodb").MongoClient;
let sequelize = require("./database/Db");
const MySQL = require("./routes/MySQL");
let Incident = require("./model/Incident");
let Logged = require("./model/LoggedTest");
const { INTEGER } = require("sequelize/types");
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
    //   const rule = rules.incidentValue;
    //   console.log(rules);
    //   console.log("rule 2 :" + rule);
    // });
    app.post("/fetchData", async (req, res) => {
      try {
        const rules = await Incident.findOne({
          where: {
            incidentName: "RPM",
          },
        }).then((rule) => {
          return rule;
        });
        const rule = rules.incidentValue;
        const ruleInt = parseINT(rule);
        const RPM = parseINT(req.body.kc);
        if (RPM > ruleInt) {
          const logged = await Logged.create({
            lat: req.body.kff1006,
            long: req.body.kff1005,
            time: req.body.time,
            RPM: "" + req.body.kc,
          });
          console.log("CreatedSuccess : RPM more than incident:1000");

          // console.log(req.body);
          if (!logged) {
            res.send("error cannot create logged");
          }
        } else if (req.body.kc <= rule) {
          console.log("Error cannot Created : RPM less than incident:1000");
        }

        console.log("kc : " + RPM);
        console.log("rule : " + rule);
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
