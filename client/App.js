import React from 'react';
import { StyleSheet, View, Dimensions, ScrollView } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import { MapView } from "expo";
import imgCar from './assets/images/car.png';
import imgLight from './assets/images/light.png';

import intersect from './assets/data/intersect.json'

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

const green = "rgba(0, 153, 51, 0.5)"
const red = "rgba(255, 51, 0, 0.5)"

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
    markers: [{
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

  componentDidMount = () => {
    this.renderMarkers();
    setInterval(this.changeColor, 100)
  }

  renderMarkers = () => {
    j = 1;
    for (const i of intersect) {
      if (i.lat === null || i.long === null || i.Int_no === null) {
        continue;
      }
      
      let m = {
        key: j,
        user: false,
        title: "Intersection",
        description: "Intersection",
        id:i.Int_no,
        coordinate:{latitude: i.lat,
        longitude: i.long},
        image:imgLight,
        radius: 15,
        color: green
      }

      j++;
      let t = this.state.markers;
      t.push(m)
      this.setState({ markers: t})
      return

    }
  }

  calcCrow = (coords1, coords2) =>
  {
    // var R = 6.371; // km
    var R = 6371000;
    var dLat = toRad(coords2.lat-coords1.lat);
    var dLon = toRad(coords2.lng-coords1.lng);
    var lat1 = toRad(coords1.lat);
    var lat2 = toRad(coords2.lat);
  
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c;
    return d;
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
            >
            {this.state.markers.map(marker => (
              <MapView.Circle 
                key={marker.key}
                center={marker.coordinate}
                radius = { marker.radius }
                strokeWidth = { 1 }
                strokeColor = { '#1a66ff' }
                fillColor = { marker.color }
              />
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
