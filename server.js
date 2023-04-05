// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

const beatService = require("./beat.service")

// mongoDB Configurations
const mongoose = require("mongoose")

// connect to database Pulse to store Beats :)
mongoose.connect(
  `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@bopper.dawmi.mongodb.net/pulse?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true }
);

require('./models/beat')
const beatModel = mongoose.model('Beat')

var db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  console.log("Connection To MongoDB Atlas Successful!");
});

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.post("/beat", (req, res) => {

  // save request to mongoDB
  let newDate = new Date().toISOString();
  const newBeatDataInstance = new beatModel({
    request: `/beat ` + req.body.text,
    timestamp: newDate
  });
  newBeatDataInstance.save();
  
  // generate response
  console.log(req.body.text);
  let strArray = req.body.text.toUpperCase().split(' ');
  console.log(strArray[0]);
  let response;
  
  switch (strArray[0])
  {
    case "HELP":
    case "H":
      response = beatService.getHelp();
      break;
    case "NOW":
    case "":
      response = beatService.getCurrentBeat();
      break;
    case "NEXT":
    case "N":
      response = beatService.getNextBeat();
      break;
    case "DATE":
    case "D":
      if(new Date(strArray[1]) == "Invalid Date")
        {
          response = "Invalid Date provided, please try again"
        }
      else
        {
          response = beatService.getBeatFromDate(strArray[1]);
        }
      break;
    case "BEAT":
    case "B":
      if(strArray.length < 2)
        {
          response = "Obtaining beat info requires a beat number to get.";
        }
      else if(strArray[1] < 1 || strArray[1] > 26 )
        {
          response = "Beat must be a number from 1 to 26.";
        }
      else
        {
          response = strArray.length <= 2 ? 
            beatService.getBeatDates(strArray[1]) : 
            beatService.getBeatDates(strArray[1], strArray[2]);          
        }
      break;
    case "WEEK":
    case "W":
      if(strArray.length < 2)
        {
          response = "Obtaining week info requires a week number to get.";
        }
      else if(strArray[1] < 1 || strArray[1] > 52 )
        {
          response = "Week must be a number from 1 to 52.";
        }
      else
        {
          response = strArray.length <= 2 ? 
            beatService.getWeekDates(strArray[1]) : 
            beatService.getWeekDates(strArray[1], strArray[2]);          
        }
      break;
    case "QUARTER":
    case "Q":
      if(strArray.length < 2)
        {
          response = "Obtaining quarter info requires a quarter number to get.";
        }
      else if(strArray[1] < 1 || strArray[1] > 4)
        {
          response = "Quarter must be a number from 1 to 4.";
        }
      else
        {
          response = strArray.length <= 2 ? 
            beatService.getQuarterDates(parseInt(strArray[1])) : 
            beatService.getQuarterDates(strArray[1], strArray[2]);
        }
      break;
    case "HACK":
      response = beatService.getNextHack();
      break;
    default:
      response = "I'm prepping a sweet beat. Stay tuned!"
  }
  
  res.status(200).json({text:response})
});

app.get("/status", (req,res) => {
  res.status(200).json({text:"hello world"});
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
