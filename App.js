import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import RootNavigator from './navigation/RootNavigator';

export default class App extends React.Component {
  render() {
    return (
      <RootNavigator />
    );
  }
}
