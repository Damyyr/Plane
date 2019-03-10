import React from 'react';
import { StyleSheet, Text, View, Dimensions, ScrollView,TouchableHighlight, TouchableOpacity, Button } from 'react-native';
import Toast, {DURATION} from 'react-native-easy-toast'
import { AppLoading, Asset, Font, Icon } from 'expo';
import { MaterialIcons } from '@expo/vector-icons'
import { MapView } from "expo";
import imgCar from './assets/images/car.png';
import imgLight from './assets/images/light.png';
import calcDist from './components/utils'
import Route from './route'
import imgPedestrian from './assets/images/pedestrian-walking.png';
import imgBlind from './assets/images/hide.png';
import intersect from './assets/data/intersect.json';

import openSocket from 'socket.io-client';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const green = "rgba(0, 153, 51, 0.8)";
const red = "rgba(255, 51, 0, 0.8)";
const orange = "rgba(255, 204, 0, 0.8)";

const startLat = 45.533475
const startLong = -73.570720

const demoRoutePoints = [
  {
    latitude: 45.533475,
    longitude: -73.570720,
    IntNo: 678,
  },
  {
    latitude: 45.534085,
    longitude: -73.570177,
    IntNo: 705,
  },
  {
    latitude: 45.532798,
    longitude: -73.567383,
    IntNo: 700,
  },
  {
    latitude: 45.532179,
    longitude: -73.567960,
    IntNo: 681,
  },
];

let pointInRoute = 0;
const speedOfRoute = 0.01*5;
const carRefreshRate = 1000 / 5; // ms
let demoRoute = new Route(demoRoutePoints);

console.disableYellowBox = true;

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
    markers: [{
      type:"marker",
      key:0,
      user: true,
      radius:15,
      // coordinate: {latitude: 46.816592, longitude: -71.200432},
      coordinate: {latitude: startLat, longitude: startLong},
      title:"title",
      description:"description",
      image:imgCar,
      color: 'rgba(230,238,255,0.5)'
    }],
    tempMarkers: [],
    // socket: openSocket('https://planehack.herokuapp.com/')
    socket: openSocket('http://plane.mdamour.info')
  };

  componentWillMount = () => {

    this.state.socket.on("lightStates", resp => {
      let markerLights = []

      // let markersToGet = this.getMarkersToGet()
      // console.log(markersToGet);

      for (const light of resp.data) {
        markerLights.push(this.changeLightColor(light))
      }
      this.setState({ tempMarkers: [...this.state.tempMarkers, markerLights] })
    })

    this.createMarkers();

    this.state.socket.on("connection", (socket) => {
      this.serverCallLightState()
    })

    this.state.socket.on("clientSendLightStates", (socket) => {
      this.serverCallLightState()
    })
  }

  changeLightColor = (light) => {
    let markerLights = this.state.markers.filter(elm => elm.id == light.Int_no)
    for (let markerLight of markerLights) {
      if (markerLight.id == light.Int_no && markerLight.type === "circle" && markerLight.title !== "Intersection" ) {
        if (light.greenFor === "A") {
          if (markerLight.dir === "N" || markerLight.dir === "S") {
            markerLight.color = green
          } else {
            markerLight.color = red
          }
        } else {
          if (markerLight.dir === "E" || markerLight.dir === "W") {
            markerLight.color = green
          } else {
            markerLight.color = red
          }
        }
        // if (markerLight.color == green) {
        //   markerLight.color = red;
        // } else {
        //   markerLight.color = green;
        // }
      }
      if (markerLight.id == light.Int_no && markerLight.type === "polyline") {
        if (markerLight.dir === "N") {
          markerLight.color = this.colorBranches(light.TrafficN)
        } else if (markerLight.dir === "S") {
          markerLight.color = this.colorBranches(light.TrafficS)
        } else if (markerLight.dir === "E") {
          markerLight.color = this.colorBranches(light.TrafficE)
        } else {
          markerLight.color = this.colorBranches(light.TrafficW)
        }
      }
    }

    return markerLights;
  }

  colorBranches = (TrafficD) => {
    let rc = TrafficD * 2.5
    let rg = 150 - (TrafficD * 1.5)
    let rb = (50 - TrafficD) < 0 ? 0 : 50 - TrafficD
    // return `rgba(1, 1, 1, 0.8)`
    return `rgba(${rc}, ${rg}, ${rb}, 0.8)`
  }

  getMarkersToGet = () => {
    let markersToGet = []
    for (let marker of this.state.markers.filter(elm => elm.title === "Intersection" && elm.type === "circle")) {
      if (calcDist(marker, this.state.markers.filter(elm => elm.user === true)[0]) > 600) {
        continue;
      }
      
      markersToGet.push(marker.id)
    }
    return markersToGet
  }

  serverCallLightState = () => {
    let markersToGet = this.getMarkersToGet()
    this.state.socket.emit("lightStates", { data: markersToGet })
  }

  createMarkers = () => {
    j = 1;
    for (const i of intersect) {
      if (i.Lat === null || i.Long === null || i.IntNo === null) {
        continue;
      }
      
      let theImage = undefined;
      
      if (i.Malvoyant) {
        theImage = imgBlind;
      } else if (i.Pieton) {
        theImage = imgPedestrian;
      }

      let m = {
        type:"circle",
        key: j,
        user: false,
        title: "Intersection",
        description: "Intersection",
        id:i.IntNo,
        coordinate:{latitude: i.Lat,
        longitude: i.Long},
        image: theImage,
        radius: 7,
        color: (i.Pieton) ? orange : green
      }

      if (calcDist(m, this.state.markers.filter(elm => elm.user === true)[0]) > 600) {
        continue;
      }

      let t = this.state.markers;
      t.push(m)
      this.setState({ markers: t})
      j++
      
      this.createCirclesAround(i, 0.0001/1.5, -0.0001, "N");
      this.createCirclesAround(i, -0.0001/1.5, +0.0001, "S");
      this.createCirclesAround(i, 0.0001, 0.0001, "E");
      this.createCirclesAround(i, -0.0001, -0.0001, "W");
    }
  }

  createLinesAround = (p, lat, long, dir) => {
    let m = {
      type:"polyline",
      key: j,
      dir: dir,
      user: false,
      id:p.id,
      coordinate: [{latitude: p.coordinate.latitude,
      longitude: p.coordinate.longitude},
      {latitude: p.coordinate.latitude + lat,
      longitude: p.coordinate.longitude + long}],
      color: green
    }
    let t = this.state.markers;
    t.push(m)
    this.setState({ markers: t})
    j++
  }

  createCirclesAround = (i, lat, long, dir) => {
    let m = {
      type:"circle",
      key: j,
      dir: dir,
      user: false,
      id:i.IntNo,
      coordinate:{latitude: i.Lat+lat,
      longitude: i.Long+long},
      image:imgLight,
      radius: 4,
      color: (dir === "N" || dir === "S") ? green : red
    }
    let t = this.state.markers;
    t.push(m)
    this.setState({ markers: t})
    j++

    this.createLinesAround(m, lat, long, dir)
  }

  changeColor = () => {
    let o = this.state.markers;
    for (let k of o) {
      if (k.id == 661 && k.type === "circle" && k.title !== "Intersection") {
        if (k.color == green) {
          k.color = red;
        } else {
          k.color = green;
        }
      }
    }
    this.setState({ markers: o})
  }

  moveCar = () => {
    let marks = this.state.markers;
    let petiteVoiture = marks.filter(elm => elm.user === true)[0];
    
    let indexToDelete = marks.findIndex((elm) => {
      return elm.user;
    });

    let newPositionCar = demoRoute.getPosition(pointInRoute);
    prevPositionCalc = Math.floor(pointInRoute-speedOfRoute % 4);
    newPositionCalc = Math.floor(pointInRoute % 4);
    let nextPositionCalc = Math.floor(pointInRoute+speedOfRoute % 4);

    if (newPositionCalc != prevPositionCalc) {
      let direction = "" 
      if (newPositionCalc%2) {
        direction = "W"
      } else {
        direction = "N"
      }

      if (this.state.markers.filter(elm => elm.id == demoRoutePoints[newPositionCalc].IntNo && 
        elm.type === "circle" && elm.title !== "Intersection" && elm.dir === direction)[0].color === green ) {
        if (nextPositionCalc == 4) {
          pointInRoute = 0;
        }
        let dg = Math.floor(Math.random() * 11) + 13;
        this.refs.toast.show(<View>
          <Text style={styles.toastText}>🌳 {(dg/840).toFixed(2)} kg de co2</Text>
          <Text style={styles.toastText}>💲 0.01 dollars</Text>
          <Text style={styles.toastText}>⏲️ {dg} secondes</Text>
          </View>,DURATION.LENGTH_LONG);
        
        this.moveTheCarMarker(indexToDelete, newPositionCar, marks)
      }
    } else {
      this.moveTheCarMarker(indexToDelete, newPositionCar, marks)
    }
  };

  moveTheCarMarker = (indexToDelete, newPositionCar, marks) => {
    let newCar = {
      type:"marker",
      key:0,
      user: true,
      radius:15,
      // coordinate: {latitude: 46.816592, longitude: -71.200432},
      coordinate: newPositionCar,
      title:"title",
      description:"description",
      image:imgCar,
      color: 'rgba(230,238,255,0.5)'
    };

    pointInRoute += speedOfRoute;

    marks.splice(indexToDelete, 1)
    marks.push(newCar);
    this.setState({ markers: marks });
  }  

  componentDidMount = () => {
     setInterval(this.moveCar, carRefreshRate);
  }

  renderElementsMap = (marker) => {
    if (marker.type === "circle") {
      return <MapView.Circle 
        key={marker.key}
        center={marker.coordinate}
        radius = { marker.radius }
        strokeWidth = { 1 }
        strokeColor = { '#1a66ff' }
        fillColor = { marker.color }
      />
    } else if (marker.type === "marker") {
      if (marker.image !== undefined) {
        return <MapView.Marker 
          key={marker.key}
          coordinate={marker.coordinate}
          image = {marker.image}
        />
      }
    } else {
      return <MapView.Polyline 
        key={marker.key}
        coordinates={marker.coordinate}
        strokeColor={marker.color}
        strokeColors={[
          marker.color
        ]}
		    strokeWidth={6}
      />
    }
  }

  onPressButton = () => {
    // setInterval(this.changeColor, 1000)
    let direction = "" 
    switch (prevPositionCalc) {
      case -1:
        direction = "E"
        break;
      case 0:
        direction = "S"
        break;
      case 1:
        direction = "W"
        break;
      case 2:
        direction = "N"
        break;
      default:
        break;
    }

    this.state.socket.emit("feedback", {data: { id: demoRoutePoints[newPositionCalc].IntNo, dir: direction }})
  }

  render() {
    
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <View style={styles.container}>
        <View style={styles.toast}>
            <Toast
                ref="toast"
                style={styles.notification}
                position='bottom'
                positionValue={200}
                fadeInDuration={750}
                fadeOutDuration={1000}
                textStyle={{color: "white"}}
            />
        </View>

        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.getStartedContainer}>
            <MapView
              style={{
                width: width,
                height: height,
                flex: 1
              }}
              initialRegion={{
                // latitude: 46.816592,
                // longitude: -71.200432,
                latitude: startLat,
                longitude: startLong,
                latitudeDelta: 0.0922/25,
                longitudeDelta: 0.0421/25
              }}
              // showsTraffic={true}
            >
            {this.state.markers.map(marker => (
              this.renderElementsMap(marker)
            ))}
            </MapView>
          </View>
        </ScrollView>
          <TouchableOpacity onPress={this.onPressButton} style={styles.fab}>
            <Text style={styles.fabIcon}>
              <MaterialIcons name="traffic" style={styles.fabIcon}/>
            </Text>
          </TouchableOpacity>
      </View>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      }),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  button: {
    zIndex: 99,
    position: "absolute",
    top: 0,
    right: 0,
    marginTop: 40
  },
  toast: {
    zIndex: 99,
    marginTop: 20
  },
  notification: {
    width: "80%",
    padding: 50,
    backgroundColor: "rgba(77, 182, 172, 0.8)"
  },
  toastText: {
    textAlign: 'center'
  },
  fab: {
    position: 'absolute',
    width: 65,
    height: 65,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#f43922',
    borderRadius: 30,
    elevation: 8
  },
  fabIcon: {
    lineHeight: 42,
    fontSize: 40,
    color: 'white'
  },
});
