import React from 'react';
import { StyleSheet, Text, View, Platform, Alert, Dimensions } from 'react-native';

import MapView from 'react-native-maps';

import { Constants, Location, Permissions } from 'expo';

let { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;


export default class Home extends React.Component {
  state = {
    stations: null,
    errorMessage: null,
    region: {}
  };

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }
    let location = await Location.getCurrentPositionAsync({});
    const body = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    }
    this.setState({
      region: body,
    });
  };

  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
  }

  componentDidMount() {
    this.fetchPlaces();
  }

  async fetchPlaces() {
    try {
      let response = await fetch(`https://api.voltaapi.com/v1/stations`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
      });

      let responseJSON = null

      if (response.status === 200) {
        responseJSON = await response.json();


        this.setState({ stations: responseJSON });
      } else {
        responseJSON = await response.json();
        const error = responseJSON.message

        // this.setState({ errors: responseJSON.errors })
        Alert.alert('failed!', `Unable to load profile.. ${error}!`)
      }
    } catch (error) {
      this.setState({ response: error })

      console.log(error)

      Alert.alert('failed ', 'Please try again later')
    }
  }

  render() {
    return (
      this.state.stations ?
        <MapView
          region={this.state.region}
          style={styles.container}
        >
          {this.state.stations.map((marker, index) => {
            const coordinatesMap = marker.location.coordinates
            const coordobj = {
              latitude: coordinatesMap[1],
              longitude: coordinatesMap[0]
            }
            return (
              <MapView.Marker key={index}  coordinate={coordobj}>
              </MapView.Marker>
            );
          })}
        </MapView>
        : 
      <View style={styles.container}>
        <Text>Wait!!!!</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});