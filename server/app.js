const server = require("http").createServer()
const io = require("socket.io")(server)
let mongoose = require('mongoose');
let option = { useNewUrlParser: true }
const intersect = require('./intersect.json')
const axios = require('axios')

mongoose.connect(`mongodb://${process.env.dbuser}:${process.env.dbpassword}@ds163822.mlab.com:63822/plane`, option).then(
  () => { console.log('Successfully connected');},
  err => { throw err }
);

let branchesSchema = mongoose.Schema({
  currentTimer: Number,
  direction: String,
  trafficInd: Number
})

let directionSchema = mongoose.Schema({
  directionTimer: Number,
  direction: String
})

let intersectSchema = mongoose.Schema({
  Int_no: Number,
  long: Number,
  lat: Number,
  Pieton: Boolean,
  Malvoyant: Boolean,
  nbPieton: Number,
  defaultTimer: Number,
  lastChange: Date,
  directions: [directionSchema],
  branches: [branchesSchema]
});

let IntersectModel = mongoose.model('IntersectModel', intersectSchema);

// for (const i of intersect) {
    
//   let dirA = {
//     directionTimer: i.Direction1,
//     direction: "A"
//   }

//   let dirB = {
//     directionTimer: i.Direction2,
//     direction: "B"
//   }

//   let branchesN = {
//     currentTimer: 0,
//     direction: "N",
//     trafficInd: 0
//   }

//   let branchesS = {
//     currentTimer: 0,
//     direction: "S",
//     trafficInd: 0
//   }

//   let branchesE = {
//     currentTimer: 0,
//     direction: "E",
//     trafficInd: 0
//   }

//   let branchesW = {
//     currentTimer: 0,
//     direction: "W",
//     trafficInd: 0
//   }

//   let nh = {
//     Int_no: i.Int_no,
//     long: i.long,
//     lat: i.lat,
//     Pieton: i.Pieton,
//     nbPieton: i.Nbr_Pieton,
//     Malvoyant: i.Malvoyant,
//     defaultTimer: 0,
//     lastChange: Date.now(),
//     directions: [dirA, dirB],
//     branches: [branchesN, branchesS, branchesE, branchesW]
//   }

//   let Intersect_inst = new IntersectModel(nh);

//   Intersect_inst.save(function(err) {
//     if (err) throw err;
  
//     console.log('UserSchema successfully saved.');
//   });
// }

io.on("connection", client => {

  console.log("Sup bitch");
  
  client.on('lightStates', data => {
    let response = []
    IntersectModel.find({'Int_no': {$in:data}}, function (err, res) {
      if (err) return handleError(err);

      for (const intersection of res) {
        let lastChange = res.lastChange;
        let secondsSinceLastChange = Math.round((Date.new - lastChange) / 1000);
        let dirA = intersection.directions.filter(elem => elem.direction = 'A')[0];
        let dirB = intersection.directions.filter(elem => elem.direction = 'B')[0];

        let totalCycle = dirA.directionTimer + dirB.directionTimer;
        let direction = secondsSinceLastChange % totalCycle;
        let greenFor = direction <= dirA.directionTimer ? 'A' : 'B';

        response.push({
          Int_no: res.Int_no,
          greenFor: greenFor
        });
      }

      console.log(response);
    });

    client.emit('lightStates', { data: response })
  });

  client.on("feedback", data => { 
    IntersectModel.find({ 'Int_no': 661 }, 'lat long', function (err, mintersect) {
      if (err) return handleError(err);

      let url = `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?point=${mintersect[0].lat}%2C${mintersect[0].long}&unit=KMPH&key=${process.env.tomtomapi}`
      // let url = `https://traffic.api.here.com/traffic/6.1/flow.json?bbox=${mintersect[0].lat}%2C${mintersect[0].long}%3B${mintersect[0].lat}%2C${mintersect[0].long}&app_id=${process.env.hereappid}&app_code=${process.env.hereappcode}`
      axios.get(url).then((resp) => {
        console.log(resp.data.flowSegmentData);
        if (resp.data.flowSegmentData) {
          client.emit("feedback-answer", { data: `Retour de l'algo vraiment fou ${algoVraimentComplique(resp.data.flowSegmentData)} || ${mintersect[0].lat}, ${mintersect[0].long}` })
        }
      }).catch((err) => {
        throw err
      })
    })
  })

  client.on("disconnect", () => { 
    console.log("bye")
  })
})

function algoVraimentComplique(flowData) {
  let a = flowData.currentSpeed
  let b = flowData.freeFlowSpeed
  let ab = a/b;
  return `${a} || ${b} || ${ab}`;
}

server.listen(process.env.PORT || 4000)
console.log("Started")