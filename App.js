import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import RootNavigator from './navigation/RootNavigator';
import {Font} from 'expo';


export default class App extends React.Component {
  state= {
    fontLoaded: false
  }
  async componentDidMount() {
    await Font.loadAsync({
      'product-sans-regular': require('./assets/Product-Sans-Regular.ttf'),
      'product-sans-bold': require('./assets/Product-Sans-Bold.ttf'),
    });
    this.setState({ fontLoaded: true });
  }

  render() {
    return (
      <RootNavigator />
    );
  }
}
