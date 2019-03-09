export default function calcDist(coords1, coords2) {
    // var R = 6.371; // km
    var R = 6371000;
    var dLat = toRad(coords2.coordinate.latitude-coords1.coordinate.latitude);
    var dLon = toRad(coords2.coordinate.longitude-coords1.coordinate.longitude);
    var lat1 = toRad(coords1.coordinate.latitude);
    var lat2 = toRad(coords2.coordinate.latitude);
  
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c;
    return d;
  }

  function toRad(Value) {
    return Value * Math.PI / 180;
  }