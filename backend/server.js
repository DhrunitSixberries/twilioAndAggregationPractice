import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import twilio from "twilio";
import connectDB from "./config/db.js";
import Persons from "./models/Persons.js";
dotenv.config();

connectDB();
const app = express();

app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
  res.send("test");
});

app.get("/users", async (req, res) => {
  let firstProjectionObject = { _id: 0, name: 1, picture: 1 };
  let secondProjectionObject = {
    pictureUrl: "$picture.large",
    fullName: { $concat: ["$name.first", " ", "$name.last"] },
  };
  if (req.query.filters) {
    let filterArray = req.query.filters.split(",");
    for (const filter of filterArray) {
      if (!firstProjectionObject[filter]) {
        firstProjectionObject[filter] = 1;
        secondProjectionObject[filter] = 1;
      }
    }
  }
  let page = parseInt(req.query.page);
  let toSkip = page * 12;
  const aggregate = await Persons.aggregate([
    { $project: firstProjectionObject },
    { $sort: { "name.first": 1 } },
    {
      $project: secondProjectionObject,
    },
  ])
    .skip(toSkip)
    .limit(12)
    .sort({ fullName: 1 });
  res.send(aggregate);
});

app.post("/sendSms", async (req, res) => {
  const client = twilio(
    process.env.TWILIOACCOUNTSSID,
    process.env.TWILIOAUTHCODE
  );
  try {
    client.messages
      .create({
        to: req.body.number,
        from: "+19302006103",
        body: "Hello from twilio",
      })
      .then((success) => {
        console.log(success);
        res.send("Sms sent");
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  } catch (error) {
    console.log(error);
    res.send("An error occured");
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
