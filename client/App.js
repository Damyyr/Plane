import React from 'react';
import { StyleSheet, View, Dimensions, ScrollView } from 'react-native';
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
const redHex = "#ff0000"
const greenHex = "#009933"

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
      coordinate: {latitude: 46.816592,
      longitude: -71.200432},
      title:"title",
      description:"description",
      image:imgCar,
      color: 'rgba(230,238,255,0.5)'
    }]
  };

  componentWillMount = () => {
    // var io = openSocket('https://planehack.herokuapp.com/');
    
    this.renderMarkers();
    // setInterval(this.changeColor, 100)
  }

  renderMarkers = () => {
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
        color: green
      }

      if (calcDist(m, this.state.markers.filter(elm => elm.user === true)[0]) > 1000) {
        continue;
      }

      let t = this.state.markers;
      t.push(m)
      this.setState({ markers: t})
      j++

      this.createCirclesAround(i);
      this.createCirclesAround(i);
      this.createCirclesAround(i);
      this.createCirclesAround(i);
    }
  }

  createLinesAround = () => {
    
  }

  createCirclesAround = (i) => {
    let m = {
      type:"circle",
      key: j,
      user: false,
      title: "Intersection",
      description: "Intersection",
      id:i.Int_no,
      coordinate:{latitude: i.lat+0.0001,
      longitude: i.long},
      image:imgLight,
      radius: 4,
      color: green
    }
    let t = this.state.markers;
    t.push(m)
    this.setState({ markers: t})
    j++

    m = {
      type:"polyline",
      key: j,
      user: false,
      id:i.Int_no,
      coordinate:[{latitude: i.lat+0.0001,
      longitude: i.long},
      {latitude: i.lat+0.0001*2,
      longitude: i.long}],
      image:imgLight,
      radius: 4,
      color: greenHex
    }
    t = this.state.markers;
    t.push(m)
    this.setState({ markers: t})
    j++

    m = {
      type:"circle",
      key: j,
      user: false,
      title: "Intersection",
      description: "Intersection",
      id:i.Int_no,
      coordinate:{latitude: i.lat-0.0001,
      longitude: i.long},
      image:imgLight,
      radius: 4,
      color: green
    }
    t = this.state.markers;
    t.push(m)
    this.setState({ markers: t})
    j++

    m = {
      type:"polyline",
      key: j,
      user: false,
      id:i.Int_no,
      coordinate:[{latitude: i.lat-0.0001,
      longitude: i.long},
      {latitude: i.lat-0.0001*2,
      longitude: i.long}],
      image:imgLight,
      radius: 4,
      color: greenHex
    }
    t = this.state.markers;
    t.push(m)
    this.setState({ markers: t})
    j++

    m = {
      type:"circle",
      key: j,
      user: false,
      title: "Intersection",
      description: "Intersection",
      id:i.Int_no,
      coordinate:{latitude: i.lat,
      longitude: i.long+0.0001*1.5},
      image:imgLight,
      radius: 4,
      color: green
    }
    t = this.state.markers;
    t.push(m)
    this.setState({ markers: t})
    j++

    m = {
      type:"polyline",
      key: j,
      user: false,
      id:i.Int_no,
      coordinate:[{latitude: i.lat,
      longitude: i.long+0.0001*1.5},
      {latitude: i.lat,
      longitude: i.long+0.0001*1.5*2}],
      image:imgLight,
      radius: 4,
      color: greenHex
    }
    t = this.state.markers;
    t.push(m)
    this.setState({ markers: t})
    j++

    m = {
      type:"circle",
      key: j,
      user: false,
      title: "Intersection",
      description: "Intersection",
      id:i.Int_no,
      coordinate:{latitude: i.lat,
      longitude: i.long-0.0001*1.5},
      image:imgLight,
      radius: 4,
      color: green
    }
    t = this.state.markers;
    t.push(m)
    this.setState({ markers: t})
    j++

    m = {
      type:"polyline",
      key: j,
      user: false,
      id:i.Int_no,
      coordinate:[{latitude: i.lat,
      longitude: i.long-0.0001*1.5},
      {latitude: i.lat,
      longitude: i.long-0.0001*1.5*2}],
      image:imgLight,
      radius: 4,
      color: greenHex
    }
    t = this.state.markers;
    t.push(m)
    this.setState({ markers: t})
    j++
  }

  changeColor = () => {
    let o = this.state.markers;
    for (let k of o) {
      if (k.user) {
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
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.getStartedContainer}>
            <MapView
              style={{
                width: width,
                height: height,
                flex: 1
              }}
              initialRegion={{
                latitude: 46.816592,
                longitude: -71.200432,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421
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
});
