import React from 'react';
import { StyleSheet, Text, View, Platform, Animated, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { Header, Icon, Button, Divider } from 'react-native-elements';
import MapView from 'react-native-maps';
// import openMap from 'react-native-open-maps';
import { LinearGradient } from 'expo';
import * as Progress from 'react-native-progress';

import MapViewDirections from 'react-native-maps-directions';
import openMap from 'react-native-open-maps';

import Swiper from 'react-native-swiper';

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

  _renderSwiper() {
    const {statInfo} = this.state;
    return (
    <Swiper containerStyle={styles.swiperView} activeDotColor="#4CD3D9" loop={false} >
      <View style={styles.stationView}>
        <Text style={styles.swiperInHeader}>Stations</Text>
        {statInfo.stations.map((station, index) => {
          return (
            <View key={index}>
              <Text style={{ color: '#434343', fontSize: 20, fontWeight: '500', fontFamily: 'product-sans-regular' }}>{station.name}</Text>
              <Text style={{ color: '#B9B9B9', fontFamily: 'product-sans-regular' }}>{station.status}</Text>
              <Divider style={{ marginTop: 10, marginBottom: 10, height: 0.5, backgroundColor: '#C6C6C6' }} />
            </View>
          )
        })}
      </View>
      <View style={styles.chargerView}>
        <Text style={styles.swiperInHeader}>Chargers</Text>
        {statInfo.chargers.map((charger, index) => {
          const prog = (charger.available / charger.total)
          return (
            <View key={index} style={styles.progressView}>
              <Progress.Bar color={'#4CD3D9'} width={300} progress={prog} height={14} borderRadius={7} style={{ marginBottom: 10 }} />
              <Text style={{ color: '#434343', marginBottom: 25, fontFamily: 'product-sans-regular' }}>{charger.available} OF {charger.total} AVAILABLE - {charger.level}</Text>
            </View>
          )
        })}
      </View>
    </Swiper>
    )
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
    const GOOGLE_MAPS_APIKEY = 'AIzaSyCgDFkATazSiKPqTPCMx09YMZ8wft1KzOo';
    return (
      <ScrollView style={{ flex: 1, flexDirection:'column' }}>
        <View style={styles.mapView}>
          <MapView 
          showsUserLocation={true} 
          region={regionObj}
            ref={(ref) => { this.mapRef = ref }}
            onMapReady={() => this.mapRef.fitToCoordinates([origin, destination], {
              edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
              animated: true,
            })}
            style={{flex:1}}>
            <MapViewDirections
              origin={origin}
              destination={destination}
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={3}
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
        <View style={styles.detailView}>
          <Text style={styles.headerText}>{statInfo.name}</Text>
          {this._renderSwiper()}
          <TouchableOpacity onPress={() => openMap({ travelType: ['drive'], end:`${regionObj.latitude}, ${regionObj.longitude}`})} style={styles.cardBtn}>
            <LinearGradient colors={['#55D0B4', '#51D0C4', '#4CD3D9']} style={styles.cardBtn}>
            <Text style={{ fontSize: 30, fontWeight: '700', color: "#fff", fontFamily: 'product-sans-bold'}}>GO</Text>
          </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    )
  }

}

const styles = StyleSheet.create({
  mapView: {
    flex:1, 
    height: height/2
  },
  detailView: {
    flex:1,
    padding: 20,
  },
  swiperView: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    height: height/2.5,
    marginVertical: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 1,
  },
  stationView: {
    padding: 20,
    flex:1,
    // backgroundColor:'hotpink'
  },
  chargerView: {
    flex: 1,
    padding: 20,
    // backgroundColor: 'orange'
  },
  progressView: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerText: {
    fontFamily:'product-sans-bold',
    fontSize: 40,
    fontWeight: '700',
    marginRight: 70
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
  cardBtn: {
    position:"absolute",
    right: 20,
    top: -20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  swiperInHeader: {
    fontFamily: 'product-sans-bold',
    fontSize: 25,
    color: '#434343',
    marginBottom: 30,
  }
});