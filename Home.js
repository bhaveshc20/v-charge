import React from 'react';
import { StyleSheet, Text, View, Platform, Alert, Dimensions } from 'react-native';

import MapView from 'react-native-maps';

export default class Home extends React.Component {
  state = {
    stations: null,
  };

  componentDidMount() {
    console.log(this.fetchPlaces())
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
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
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