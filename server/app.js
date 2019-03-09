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

let intersectSchema = mongoose.Schema({
  Int_no: Number,
  long: Number,
  lat: Number,
  Pieton: Boolean
});

var IntersectModel = mongoose.model('IntersectModel', intersectSchema);

// let IntersectModel = mongoose.model('IntersectModel', userSchema );

// for (const i of intersect) {

//   let Intersect_inst = new IntersectModel(i);

//   Intersect_inst.save(function(err) {
//     if (err) throw err;
  
//     console.log('UserSchema successfully saved.');
//   });
// }

io.on("connection", client => {

  console.log("Sup bitch");
  
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