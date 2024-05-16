// NoInternetPage.tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle, Image, ImageStyle } from 'react-native';
import { Button } from './Button';
import { colors, spacing } from 'app/theme';

const noInternetLogo = require('../../assets/images/noInternetConnection.png');

interface NoInternetConnectionProps {
  onRetry: () => void;
}

export const NoInternetConnection: React.FC<NoInternetConnectionProps> = ({ onRetry }) => {
  return (
    <View style={$container}>
      <Image source={noInternetLogo} style={$wifiLogoStyle} />
      <Text style={$title}>No Internet Connection</Text>
    </View>
  );
};


const $container: ViewStyle = {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
}
const $wifiLogoStyle: ImageStyle = {
 width:120,
 height:120
}
const $title: TextStyle = {
  fontSize: 24,
  fontWeight: 'bold',
  marginBottom: 20,
}
const $retryButton: ViewStyle = {
  backgroundColor: '#007bff',
  paddingHorizontal: 20,
  paddingVertical: 10,
  borderRadius: 5,
}
const $retryButtonText: TextStyle = {
  color: '#fff',
  fontSize: 18,
}
const $bigButton: ViewStyle = {
  marginTop: spacing.xxl,
  backgroundColor: colors.ems.bigButton,
  borderRadius: 15,
  minWidth:200

}
const $bigButtonTextStyle: TextStyle = {
  fontWeight: 'bold',
  letterSpacing: 1
}

