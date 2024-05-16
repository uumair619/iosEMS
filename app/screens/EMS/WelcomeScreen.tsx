import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { Image, ImageStyle, TextStyle, View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "../../navigators"
import { colors, spacing } from "../../theme"
import { Button, Text } from "app/components"
import { RFValue } from "react-native-responsive-fontsize"

const emsLogo = require('../../../assets/images/logo-union.png')

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> { }

export const WelcomeScreen: FC<WelcomeScreenProps> = observer(function WelcomeScreen(
  _props, // @demo remove-current-line
) {
  // @demo remove-block-start
  const { navigation } = _props
  const login = () => {
    navigation.navigate('Login');
  }
  const register = () => {
    navigation.navigate('Register')
  }

  return (
    <View style={$container}>
      <View style={$logoContainer}><Image source={emsLogo} style={$logoImage} /></View>
      <View style={$buttonsContainer}>
        <Button
          testID="login-button"
          tx="loginScreen.tapToSignIn"
          style={$bigButton}
          textStyle={$bigButtonTextStyle}
          preset="reversed"
          onPress={login}
        />
        <Button
          testID="register-button"
          tx="registerScreen.register"
          style={[$bigButton, { marginTop: 15 }]}
          textStyle={$bigButtonTextStyle}
          preset="reversed"
          onPress={register}
        />
      </View>
    </View>
  )
})

const $container: ViewStyle = {
  flex: 1,
  paddingHorizontal: 18,
  justifyContent: 'center',
  backgroundColor: colors.background,
}

const $buttonsContainer: ViewStyle = {
  marginTop: spacing.xxl,
}
const $bigButton: ViewStyle = {
  marginTop: spacing.xs,
  backgroundColor: colors.ems.bigButton,
  borderRadius: 15

}
const $bigButtonTextStyle: TextStyle = {
  fontWeight: 'bold',
  letterSpacing: 1,
  fontSize:RFValue(15)
}

const $logoContainer: ViewStyle = {
  alignSelf: 'center',
  alignItems: 'center',
  justifyContent: 'center',
  width: 305,
  height: 113,
}

const $logoImage: ImageStyle = {
  width: '100%',
  height: '100%',
  resizeMode: 'contain'
}
