import React from 'react'
import { createStackNavigator, createAppContainer } from "react-navigation";
import Home from '../Home'
import DetailStation from '../DetailStation'


const RootStackNavigator = createStackNavigator({
  HomeScreen: {
    screen: Home
  },
  DetailScreen: {
    screen: DetailStation
  },
},
  {
    initialRouteName: 'HomeScreen',
    mode: 'modal',
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false
    }
  });


export default createAppContainer(RootStackNavigator);