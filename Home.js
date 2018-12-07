import React from 'react';
import { StyleSheet, Text, View, Platform, Alert, Dimensions, TouchableOpacity } from 'react-native';

import MapView from 'react-native-maps';
import { Constants, Location, Permissions, LinearGradient } from 'expo';
import { Icon } from 'react-native-elements'
import axios from 'axios';

let { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const CARD_HEIGHT = height / 12;

export default class Home extends React.Component {
  state = {
    stations: null,
    statInfo: {},
    isOpen: false,
    region: {},
    coords: {},
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


  fetchPlaces() {
    axios.get(`https://api.voltaapi.com/v1/stations`)
      .then(res => {
        const stations = res.data;
        this.setState({ stations: stations });
      })
  }

  _renderCard() {
    const { statInfo } = this.state
    return (
      <View style={styles.cardView}>
        <View style={styles.card}>
          <Text style={styles.cardName}>{statInfo.name}</Text>
        </View>
        <LinearGradient colors={['#55D0B4', '#51D0C4', '#4CD3D9']} style={styles.cardBtn}>
          <Icon
            name='plus'
            type='feather'
            color='#fff'
            size={30} />
        </LinearGradient>
      </View>
    )
  }



  render() {
    return (
      this.state.stations ?
        <View style={styles.container}>
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
                <MapView.Marker key={index} onPress={() => {
                  this.setState({
                    isOpen: true,
                    statInfo: marker,
                    coords: coordobj,
                  })
                }} image={require('./assets/flash-marker.png')} coordinate={coordobj}>
                </MapView.Marker>
              );
            })}
          </MapView>
          {this.state.isOpen ? this._renderCard() : null}
        </View>
        : <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>WAITT!!!!!</Text>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardView: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    padding: 20,
  },
  cardBtn: {
    position: "absolute",
    bottom: 80,
    height: 50,
    width: 50,
    left: width - 95,
    right: 0,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  card: {
    backgroundColor: "#FFF",
    height: CARD_HEIGHT,
    width: '100%',
    justifyContent: 'center',
    overflow: "hidden",
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    padding: 20
  },
  cardName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#434343',
    marginBottom: 5,
  },
  cardAddr: {
    fontSize: 15,
    color: '#C6C6C6',
    marginBottom: 15,
    marginRight: 35,
  },
  cardStatus: {
    fontSize: 15,
    color: '#4CD3D9'
  },
  markerWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  marker: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(130,4,150, 0.9)",
  },
  ring: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(130,4,150, 0.3)",
    position: "absolute",
    borderWidth: 1,
    borderColor: "rgba(130,4,150, 0.5)",
  },
});

