import React from 'react'
import { StyleSheet, Platform, Image, Text, View } from 'react-native'
import Login from './src/pages/login'

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
const AppNavigator = createStackNavigator({
  Login: {
    screen: Login,
  },
},
{
  initialRouteName: 'Login',
  defaultNavigationOptions: {
    headerStyle: {
      backgroundColor: '#dcdcdc',
    },
    headerTintColor: '#333',
    headerBackTitleStyle: {
      fontWeight: 'bold',
    },
  },
}
);

export default createAppContainer(AppNavigator);