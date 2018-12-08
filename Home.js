import React from 'react';
import { StyleSheet, Text, View, Platform, Alert, Dimensions, TouchableOpacity } from 'react-native';

import MapView from 'react-native-maps';
import { Constants, Location, Permissions, LinearGradient } from 'expo';
import {Icon} from 'react-native-elements';
import { MaterialIcons, Feather, Entypo, FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import * as Animatable from 'react-native-animatable';

let { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const CARD_HEIGHT = height / 14;

export default class Home extends React.Component {
  state = {
    stations: null,
    statInfo: {},
    isOpen: false,
    region: {
      latitude: null || 37.7683336666667,
      longitude: null || -122.401718333333,
      latitudeDelta: null || LATITUDE_DELTA,
      longitudeDelta: null || LONGITUDE_DELTA,
    },
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
    this.fetchPlaces();
  }



  fetchPlaces() {
    axios.get(`https://api.voltaapi.com/v1/sites-metrics`)
      .then(res => {
        const stations = res.data;
        this.setState({ stations: stations });
      })
  }

  _renderCard() {
    const { statInfo } = this.state
    return (
      <Animatable.View animation="slideInUp">
      <TouchableOpacity onPress={() => {
        { this.props.navigation.navigate('DetailScreen', { statInfo: statInfo, coordobj: this.state.coords, region: this.state.region }) }
      }} style={styles.cardView}>
      {/* <Animatable.View animation="slideInUp"> */}
          <Text style={styles.cardName}>{statInfo.name}</Text>
        <LinearGradient colors={['#55D0B4', '#51D0C4', '#4CD3D9']} style={styles.cardBtn}>
          <Icon
            name='directions'
            type='FontAwesome5'
            color='#fff'
            size={40} />
        </LinearGradient>
      {/* </Animatable.View> */}
      </TouchableOpacity>
      </Animatable.View>
    )
  }

  _renderCoords() {
    return (
      this.state.stations.map((marker, index) => {
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
      })
    )
  }


  render() {
    return (
        <View style={styles.container}>
          <MapView
            showsUserLocation={true}
            showsMyLocationButton={true}
            initialRegion={this.state.region}
            style={styles.container}
          >
            {this.state.stations? this._renderCoords() : null}
          </MapView>
          {this.state.isOpen ? this._renderCard() : null}
        <TouchableOpacity onPress={() => this._getLocationAsync()} style={styles.locationBtn}>
          <MaterialIcons
            name="my-location"
            size={Platform.OS === 'ios' ? 20 : 21}
            color="#434343"
          />
        </TouchableOpacity>
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
    flexDirection:'row',
    bottom: 30,
    left: 0,
    right: 0,
    marginHorizontal: 20,
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent:'space-between',
    flexDirection: 'row', 
    height: CARD_HEIGHT,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    borderRadius: 10,

  },
  cardBtn: {
    borderRadius: 10,
    alignItems:'center',
    justifyContent:'center',
    width: CARD_HEIGHT,
    height:CARD_HEIGHT,
  },
  cardName: {
    fontFamily: 'product-sans-regular',
    fontSize: 20,
    fontWeight: '700',
    color: '#434343',
    marginLeft: 20,
  },
  locationBtn: {
    position: 'absolute',
    height: 50,
    width: 50,
    borderRadius: 25,
    right: 10,
    top: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
});

