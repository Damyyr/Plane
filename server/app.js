const server = require("http").createServer()
const io = require("socket.io")(server)
let mongoose = require('mongoose');
let option = { useNewUrlParser: true }
const intersect = require('./intersect.json')
const axios = require('axios')
const hostname = "localhost"
const PORT = process.env.PORT || 8888

const modifierBounds = [-3, 3]
idsToUpdate = []
ligthDataSet = []

const timeToRefresh = 4000;
const timerTomTom = 120000;

// setTimeout(imNotJammed, timeToRefresh);

mongoose.connect(`mongodb://${process.env.dbuser}:${process.env.dbpassword}@ds163822.mlab.com:63822/plane`, option).then(
  () => {
    console.log('Successfully connected');
  },
  err => { throw err }
);

let branchesSchema = mongoose.Schema({
  currentTimer: Number,
  direction: String,
  trafficInd: Number // POURCENTAGE: N - 100 == congestion vers le nord
})

let directionSchema = mongoose.Schema({
  defaultTimer: Number,
  actualTimer: Number,
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

function handleError(error) {
  console.log(error);
}

function fetchTomTom() {
  if (!ligthDataSet) return;

  for (let intersection of ligthDataSet) {
    console.log(intersection);

    IntersectModel.find({ 'Int_no': intersection.Int_no }, (err, res) => {
      let tomtomObject = tomtomCall(intersection.lat, intersection.long);

      console.log(res[0]);
      
      let branches = res[0].branches;
      branches.filter(elem => elem.direction == 'N')[0].trafficInd = transfromTomTom(tomtomObject.TrafficN)
      branches.filter(elem => elem.direction == 'S')[0].trafficInd = transfromTomTom(tomtomObject.TrafficS)
      branches.filter(elem => elem.direction == 'E')[0].trafficInd = transfromTomTom(tomtomObject.TrafficE)
      branches.filter(elem => elem.direction == 'W')[0].trafficInd = transfromTomTom(tomtomObject.TrafficW)

      console.log(res[0]);

      res[0].save().then((item) => { console.log(item.Int_no) });
    });
  }

  setTimeout(fetchTomTom, timerTomTom);
}

function transfromTomTom(value) {
  return (1 - value) * 100;
}

io.on("connection", client => {
  setTimeout(calculateTraffic, timeToRefresh, client);
  setTimeout(fetchTomTom, timerTomTom);

  console.log(`Sup bitch ${client.id}`);
  client.emit('connection', { data: '' });

  client.on('lightStates', data => {
    console.log(`GUESS WHO GOT SOME IDDSSSSSSSS`);
    console.log(data);
    idsToUpdate = data.data
  });
  //   IntersectModel.find({ 'Int_no': data.data }, (err, res) => {
  //   if (err) return handleError(err);

  //   idsToUpdate = [678,661] //data.data
  //   // client.emit('lightStates', { data: res })

  //   let response = []
  //   for (const intersection of res) {
  //     let lastChange = intersection.lastChange;
  //     let secondsSinceLastChange = Math.round((new Date - lastChange) / 1000);
  //     let dirA = intersection.directions.filter(elem => elem.direction == 'A')[0];
  //     let dirB = intersection.directions.filter(elem => elem.direction == 'B')[0];

  //     let totalCycle = dirA.defaultTimer + dirB.defaultTimer;
  //     let direction = secondsSinceLastChange % totalCycle;
  //     let greenFor = direction < dirA.defaultTimer ? 'A' : 'B';

  //     response.push({
  //       Int_no: intersection.Int_no,
  //       greenFor: greenFor
  //     });
  //   }

  //   //teeest();
  //   client.emit('lightStates', { data: response })
  //   // client.emit('lightStates', { data: ligthDataSet })
  //   });
  // });

  client.on("feedback", data => {
    IntersectModel.find({ 'Int_no': data.data.id }, function (err, res) {
      if (err) return handleError(err);
      if (!res[0]) return;

      console.log(res[0]);
      dir = res[0].branches.filter(elem => elem.direction == data.data.dir)[0];
      if (dir.trafficInd) dir.trafficInd += 50;
      if (dir.trafficInd > 100) dir.trafficInd = 100;
      res[0].save();


    })
  })

  client.on("disconnect", () => {
    console.log(`bye ${client.id}`)
  })
})

function tomtomCall(lat, long) {
  let tomtom = {
    TrafficN: 0,
    TrafficS: 0,
    TrafficE: 0,
    TrafficW: 0
  }

  return tomtom;

  let url = `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?point=${lat + 0.0003}%2C${long}&unit=KMPH&key=${process.env.tomtomapi}`
  axios.get(url).then((resp) => {
    if (resp.data.flowSegmentData) {
      tomtom.TrafficW = algoVraimentComplique(resp.data.flowSegmentData)
    }
  }).catch((err) => {
    throw err
  })

  url = `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?point=${lat - 0.0003}%2C${long}&unit=KMPH&key=${process.env.tomtomapi}`
  axios.get(url).then((resp) => {
    if (resp.data.flowSegmentData) {
      tomtom.TrafficE = algoVraimentComplique(resp.data.flowSegmentData)
    }
  }).catch((err) => {
    throw err
  })

  url = `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?point=${lat}%2C${long + 0.0003}&unit=KMPH&key=${process.env.tomtomapi}`
  axios.get(url).then((resp) => {
    if (resp.data.flowSegmentData) {
      tomtom.TrafficN = algoVraimentComplique(resp.data.flowSegmentData)
    }
  }).catch((err) => {
    throw err
  })

  url = `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?point=${lat}%2C${long - 0.0003}&unit=KMPH&key=${process.env.tomtomapi}`
  axios.get(url).then((resp) => {
    if (resp.data.flowSegmentData) {
      tomtom.TrafficS = algoVraimentComplique(resp.data.flowSegmentData)
    }
  }).catch((err) => {
    throw err
  })

  // client.emit("feedback-answer", { data: `Retour de l'algo vraiment fou ${algoVraimentComplique(resp.data.flowSegmentData)} || ${lat}, ${long}` })
  return tomtom
}

function imNotJammed() {
  console.log('yo btw chu toujours up gro');
  setTimeout(imNotJammed, timeToRefresh);
}

function calculateTraffic(client) {
  console.log('Traffic is updating...');
  IntersectModel.find({ 'Int_no': idsToUpdate }, (err, res) => {
    if (err) return handleError(err);

    ligthDataSet = []
    for (const intersection of res) {
      let branches = intersection.branches;

      let pairA = branches.filter(elem => elem.direction == 'N' || elem.direction == 'S');
      let pairB = branches.filter(elem => elem.direction == 'E' || elem.direction == 'W');

      let sumA = pairA[0].trafficInd + pairA[1].trafficInd
      let sumB = pairB[0].trafficInd + pairB[1].trafficInd

      let modA = scale(sumA, 0, 200, modifierBounds[0], modifierBounds[1])
      let modB = scale(sumB, 0, 200, modifierBounds[0], modifierBounds[1])

      // add this scaled ratio to each direction actualTimer
      let lastChange = intersection.lastChange;
      let secondsSinceLastChange = Math.round((new Date - lastChange) / 1000);
      let dirA = intersection.directions.filter(elem => elem.direction == 'A')[0];
      let dirB = intersection.directions.filter(elem => elem.direction == 'B')[0];

      dirA.actualTimer = 10;
      dirB.actualTimer = 10;

      let totalCycle = dirA.actualTimer + dirB.actualTimer;
      let direction = secondsSinceLastChange % totalCycle;
      let greenFor = direction < dirA.actualTimer ? 'A' : 'B';

      ligthDataSet.push({
        Int_no: intersection.Int_no,
        greenFor: greenFor,
        TrafficN: pairA.filter(elem => elem.direction == 'N')[0].trafficInd,
        TrafficS: pairA.filter(elem => elem.direction == 'S')[0].trafficInd,
        TrafficE: pairB.filter(elem => elem.direction == 'E')[0].trafficInd,
        TrafficW: pairB.filter(elem => elem.direction == 'W')[0].trafficInd,
        lon: intersection.long,
        lat: intersection.lat,
        branches: intersection.branches
      });
    }
    if (ligthDataSet) fetchTomTom();
    client.emit('lightStates', { data: ligthDataSet });
  });
  console.log('Update Done');
  setTimeout(calculateTraffic, timeToRefresh, client);
}

function algoVraimentComplique(flowData) {
  let a = flowData.currentSpeed
  let b = flowData.freeFlowSpeed
  let ab = a / b;
  return ab;
}

const scale = (num, in_min, in_max, out_min, out_max) => {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

server.listen(PORT, hostname, () => {
  console.log("Started")

  console.log(`Server running at http://${hostname}:${PORT}/`);

});

// ------------------------------------------------------- Migration de pauvre

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
//     Int_no: i.IntNo,
//     long: i.Long,
//     lat: i.Lat,
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