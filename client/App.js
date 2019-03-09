import React from 'react';
import { StyleSheet, View, Dimensions, ScrollView, Button } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import { MapView } from "expo";
import imgCar from './assets/images/car.png';
import imgLight from './assets/images/light.png';
import calcDist from './components/utils'

import intersect from './assets/data/intersect.json'

import openSocket from 'socket.io-client';

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

const green = "rgba(0, 153, 51, 0.8)"
const red = "rgba(255, 51, 0, 0.8)"
const orange = "rgba(255, 204, 0, 0.8)"

console.ignoredYellowBox = ['Remote debugger'];
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings([
    'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
]);

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
    markers: [{
      type:"marker",
      key:0,
      user: true,
      radius:15,
      // coordinate: {latitude: 46.816592, longitude: -71.200432},
      coordinate: {latitude: 45.534964, longitude: -73.559118},
      title:"title",
      description:"description",
      image:imgCar,
      color: 'rgba(230,238,255,0.5)'
    }],
    socket: openSocket('https://planehack.herokuapp.com/')
  };

  componentWillMount = () => {
    this.state.socket.on("feedback-answer", resp => {
      alert(resp.data)
    })
    
    this.createMarkers();
  }

  createMarkers = () => {
    j = 1;
    for (const i of intersect) {
      if (i.lat === null || i.long === null || i.Int_no === null) {
        continue;
      }
      
      let m = {
        type:"circle",
        key: j,
        user: false,
        title: "Intersection",
        description: "Intersection",
        id:i.Int_no,
        coordinate:{latitude: i.lat,
        longitude: i.long},
        image:imgLight,
        radius: 7,
        color: (i.Pieton) ? orange : green
      }

      if (calcDist(m, this.state.markers.filter(elm => elm.user === true)[0]) > 1000) {
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
      coordinate:[{latitude: p.coordinate.latitude,
      longitude: p.coordinate.longitude},
      {latitude: p.coordinate.latitude+lat,
      longitude: p.coordinate.longitude+long}],
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
      id:i.Int_no,
      coordinate:{latitude: i.lat+lat,
      longitude: i.long+long},
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
      return <MapView.Marker 
        key={marker.key}
        coordinate={marker.coordinate}
        image = {marker.image}
      />
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
    this.state.socket.emit("feedback", {data: "ok"})
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
        <View style={styles.button}>
          <Button title="ALLO" onPress={this.onPressButton}/>
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
                latitude: 45.534964, 
                longitude: -73.559118,
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
  }
});
