import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useMemo, useRef, useState } from "react"
import { Image, TextInput, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { Button, Icon, Screen, Text, TextField, TextFieldAccessoryProps } from "../../components"
import { useStores } from "../../models"
import { AppStackScreenProps } from "../../navigators"
import { colors, spacing, typography } from "../../theme"
import { Spinner } from "app/components"
import { api } from "app/utils/globalConfig"
import {useIsFocused} from "@react-navigation/native"
import { RFValue } from "react-native-responsive-fontsize"
const emsLogo = require('../../../assets/images/logo-union.png')

interface LoginScreenProps extends AppStackScreenProps<"Login"> { }

export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen(_props) {
  const { navigation } = _props
  const authPasswordInput = useRef<TextInput>()
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setIsLoading] = useState(false);
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isFocused = useIsFocused();
  
  const {
    authenticationStore: { authEmail, setAuthEmail, authPassword, setAuthPassword, validationErrors, setAuthToken, setUser },
  } = useStores()

  useEffect(()=>{
    setErrorMessage("");
    setAuthEmail("");
    setAuthPassword("");    
  },[])

  const errors: typeof validationErrors = isSubmitted ? validationErrors : ({} as any)

  async function login(): Promise<void> {
    setIsSubmitted(true);
    setErrorMessage("");
    // Check for form field validation before submission
    if (Object.values(validationErrors).some((v) => !!v)) {
      console.log("Pehly form field fill karlooh phir submit karnah...");
      return;
    }

    // Let's call the API for sign-in
    try {
      setIsLoading(true);

      let response = await api.post('/login', { email: authEmail, password: authPassword })

      if (response.ok) {

        if (response?.data?.success) {
          console.log("Successfully logged in", response);
          setIsLoading(false);
          setIsSubmitted(false);
          setAuthEmail("");
          setAuthPassword("");
          setAuthToken(response?.data?.token);
          setUser(response?.data?.user)
        }else{
          setIsLoading(false);
          // console.log("SERVER ERROR - Unable to login try again later");
          setErrorMessage("SERVER ERROR - Unable to login try again later")
        }

      } else {
        console.log("Error while signing...232323", response);
        setErrorMessage(response.data?.message)
        setIsLoading(false);
        setIsSubmitted(false);
      }

    } catch (error) {
      console.log("Error while signing...", error.message);
      setErrorMessage("");
      setIsLoading(false);
      setIsSubmitted(false);
    }
  }


  const PasswordRightAccessory = useMemo(
    () =>
      function PasswordRightAccessory(props: TextFieldAccessoryProps) {
        return (
          <Icon
            icon={isAuthPasswordHidden ? "view" : "hidden"}
            color={colors.ems.inputLabel}
            containerStyle={props.style}
            size={20}
            onPress={() => setIsAuthPasswordHidden(!isAuthPasswordHidden)}
          />
        )
      },
    [isAuthPasswordHidden],
  )

  return (
    <Screen
      preset="scroll"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      <Spinner isLoading={loading} message="Signing in, please wait" />
      <View style={$logoContainer}>
        <Image source={emsLogo} style={$logoImage} />
      </View>

      
        <Text text={errorMessage} size="sm" weight="normal" style={$hint} />
    

      <View style={{ marginTop: 40, flex: 2 }}>
        <TextField
          value={authEmail}
          onChangeText={setAuthEmail}
          containerStyle={$textField}
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect={false}
          keyboardType="email-address"
          labelTx="loginScreen.emailFieldLabel"
          placeholderTx="loginScreen.emailFieldPlaceholder"
          LabelTextProps={{ style: [$labelStyles] }}
          inputWrapperStyle={$inputWrapperStyle}
          style={$inputStyle}
          helper={errors?.authEmail}
          status={errors?.authEmail ? "error" : undefined}
          onSubmitEditing={() => authPasswordInput.current?.focus()}
        />

        <TextField
          ref={authPasswordInput}
          value={authPassword}
          onChangeText={setAuthPassword}
          containerStyle={$textField}
          autoCapitalize="none"
          autoComplete="password"
          autoCorrect={false}
          secureTextEntry={isAuthPasswordHidden}
          labelTx="loginScreen.passwordFieldLabel"
          placeholderTx="loginScreen.passwordFieldPlaceholder"
          LabelTextProps={{ style: [$labelStyles] }}
          inputWrapperStyle={$inputWrapperStyle}
          helper={errors?.authPassword}
          status={errors?.authPassword ? "error" : undefined}
          RightAccessory={PasswordRightAccessory}
        />

        <Button
          testID="login-button"
          tx="loginScreen.tapToSignIn"
          style={$bigButton}
          textStyle={$bigButtonTextStyle}
          preset="reversed"
          disabled={loading}
          onPress={login}
        />
        {/* Forgot password */}
        <View style={{ alignSelf: 'center', marginTop: 25 }}>
          <Text tx="loginScreen.forgotPassword" />
          <View style={{ flexDirection: 'row' }}>
            <Text tx="loginScreen.newUser" style={[$forgotPasswordTextStyle, { paddingVertical: 5 }]} />
            <TouchableOpacity style={{ paddingHorizontal: 10, paddingVertical: 5 }} onPress={() => navigation.navigate("Register")}>
              <Text tx="loginScreen.createAccount" style={[$forgotPasswordTextStyle, { color: colors.ems.bigButton }]} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Screen>
  )
})

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
  justifyContent: 'center',
  flex: 1
}



const $hint: TextStyle = {
  color: colors.tint,
  marginTop: 40
}

const $textField: ViewStyle = {
  marginBottom: spacing.lg,
}
const $labelStyles: TextStyle = {
  color: colors.ems.inputLabel,
  fontFamily: typography.fonts.lato.normal
}

const $inputWrapperStyle: ViewStyle = {
  borderWidth: 0,
  borderBottomWidth: 1,
  borderRadius: 0,
  borderBottomColor: colors.ems.borderColor
}

const $inputStyle: ViewStyle = {
  marginHorizontal: 0
}
const $bigButton: ViewStyle = {
  marginTop: spacing.xl,
  backgroundColor: colors.ems.bigButton,
  borderRadius: 15
}

const $bigButtonTextStyle: TextStyle = {
  fontWeight: 'bold',
  letterSpacing: 1,
  fontSize:RFValue(15)
}

const $forgotPasswordTextStyle: TextStyle = {
  fontFamily: typography.fonts.lato.normal,
  color: colors.ems.customTextColor
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
