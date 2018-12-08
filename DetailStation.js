import React from 'react';
import { StyleSheet, Text, View, Platform, Animated, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { Header, Icon, Button, Divider } from 'react-native-elements';
import MapView from 'react-native-maps';
// import openMap from 'react-native-open-maps';
import { LinearGradient } from 'expo';
import * as Progress from 'react-native-progress';

import MapViewDirections from 'react-native-maps-directions';


// import Swiper from 'react-native-swiper';

let { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;



export default class DetailStation extends React.Component {
  constructor(props) {
    super(props);
    this.mapRef = null;
    const statInfo = props.navigation.state.params && props.navigation.state.params.statInfo
    const coordobj = props.navigation.state.params && props.navigation.state.params.coordobj
    const region = props.navigation.state.params && props.navigation.state.params.region
    this.state = {
      statInfo: statInfo,
      coordobj: coordobj,
      region: region,
    };
  }

  render() {
    const { statInfo, coordobj, region } = this.state;
    const regionObj = {
      latitude: coordobj.latitude,
      longitude: coordobj.longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA*1.1,
    }

    const origin = { latitude: region.latitude , longitude: region.longitude };
    const destination = { latitude: coordobj.latitude, longitude: coordobj.longitude };
    const GOOGLE_MAPS_APIKEY = '';
    return (
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.mapView}>
          <MapView 
          showsUserLocation={true} 
          region={regionObj}
            ref={(ref) => { this.mapRef = ref }}
            onMapReady={() => this.mapRef.fitToCoordinates([origin, destination], {
              edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
              animated: true,
            })}
          style={{ flex: 1 }}>
            <MapViewDirections
              origin={origin}
              destination={destination}
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={5}
              strokeColor="#4CD3D9"
            />
            <MapView.Marker image={require('./assets/flash-marker.png')} coordinate={coordobj}>
            </MapView.Marker>
          </MapView>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={styles.closeBtn}>
            <Icon
              name='close'
              color='red'
              size={Platform.OS === 'ios' ? 20 : 21}
              />
          </TouchableOpacity>
        </View>
      </ScrollView>
    )
  }

}

const styles = StyleSheet.create({
  mapView: {
    height: height - 350,
  },
  closeBtn: {
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