import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useMemo, useRef, useState } from "react"
import { Image, TextInput, TextStyle, View, ViewStyle, TouchableOpacity } from "react-native"
import { Button, Icon, Screen, Spinner, Text, TextField, TextFieldAccessoryProps } from "../../components"
import { AppStackScreenProps } from "../../navigators"
import { colors, spacing, typography } from "../../theme"
import PhoneInput from "react-native-phone-number-input";
import { validateAuthEmail, validateFullName, validatePassword } from "app/utils/registerFieldValidations"
import { api } from "app/utils/globalConfig"
import { useIsFocused } from "@react-navigation/native"
import Toast from 'react-native-root-toast';

const emsLogo = require('../../../assets/images/logo-union.png')

interface RegisterScreenProps extends AppStackScreenProps<"Register"> { }

export const RegisterScreen: FC<RegisterScreenProps> = observer(function RegisterScreen(_props) {
  const { navigation } = _props

  const authPasswordInput = useRef<TextInput>();
  const authEmailInput = useRef<TextInput>();
  const phoneNumberInput = useRef<TextInput>();
  const phoneInput = useRef<PhoneInput>(null);
  
  const [fullName, setFullName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [formErrorMessage, setFormErrorMessage] = useState([]);

  // State variables to store validation errors
  const [fullNameError, setFullNameError] = useState<string | null>(null);
  const [authEmailError, setAuthEmailError] = useState<string | null>(null);
  const [phoneNumberError, setPhoneNumberError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  
  // for spinner
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  const isFocused = useIsFocused();

  useEffect(()=>{
    setErrorMessage("");
    setAuthEmail("");
    setAuthPassword("");    
    setPhoneNumber("");    
    setFullName(""); 
    setFullNameError(null);   
    setAuthEmailError(null);   
    setPhoneNumberError(null);   
    setPasswordError(null);   
  },[isFocused])

  // Phone number validation

  const validatePhoneNumber = () => {
    console.log("Phone number validation", phoneInput?.current?.isValidNumber(phoneNumber))
    if (!phoneNumber.trim()) {
      return "Phone Number is required";
    } else if (!phoneInput.current?.isValidNumber(phoneNumber)) {
      return "Invalid phone number";
    }
    return null;
  };

 
  // Register use
  const register = async () => {


   
    setErrorMessage("")
    console.log({ name: fullName, email: authEmail, password: authPassword, mobile_no: phoneNumber })
    setFullNameError(validateFullName(fullName));
    setAuthEmailError(validateAuthEmail(authEmail));
    //setPhoneNumberError(validatePhoneNumber());
    setPasswordError(validatePassword(authPassword));
    console.log("After registration")
    
    // check for all fields errors
    if (validateFullName(fullName) || validateAuthEmail(authEmail) || validatePassword(authPassword)) {
      Toast.show('Please fill all required fields.', {
        duration: Toast.durations.LONG,
        position: Toast.positions.CENTER
      });
      setIsRegistering(false);
      return;
    }
    if (!fullName || !authEmail || !authPassword || !phoneNumber) {
      Toast.show('Please fill all required fields.', {
        duration: Toast.durations.LONG,
        position: Toast.positions.CENTER
      });
      setIsRegistering(false);
      return;
    }

    
    // call api to register user
    try {
      setIsRegistering(true);
      let response = await api.post('/register', { name: fullName, email: authEmail, password: authPassword, mobile_no: phoneNumber })
      if (response.ok) {
        console.log("Error: 1", response)
        if (response?.data?.success) {
          console.log("Successfully regester", response);
          setIsRegistering(false);
          setFullName("");
          setAuthEmail("");
          phoneInput.current.setState({ number: '' });
          setAuthPassword("");
          Toast.show('Account created successfully!.', {
            duration: Toast.durations.LONG,
            position: Toast.positions.CENTER
          });
          navigation.navigate("Login");

        }else{
          Toast.show(response?.data?.error?.email[0] ||  'Server error, please try again', {
            duration: Toast.durations.LONG,
            position: Toast.positions.CENTER
          });
          console.log("Error 2: ",response?.data?.error?.email[0])
          setIsRegistering(false);
        
        }
      } else {
        if(response.problem==="NETWORK_ERROR") {
          Toast.show(response?.problem, {
            duration: Toast.durations.LONG,
            position: Toast.positions.CENTER
          });
          setIsRegistering(false);
          return
        }
        console.log("🚀 ~ Error 3:", response)
        console.log("Successfully validated 4")
        console.log("Error while register... 1", response);
         Toast.show(response?.data?.message, {
          duration: Toast.durations.LONG,
          position: Toast.positions.CENTER
        });
        // setErrorMessage(response?.data?.message)
        setIsRegistering(false);
      }
      
    } catch (error) {
      console.log("🚀 ~ file: RegisterScreen.tsx:121 ~ register ~ error:", error)
      Toast.show(error?.message, {
        duration: Toast.durations.LONG,
        position: Toast.positions.CENTER
      });
      setIsRegistering(false);
    }


  };

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
      <Spinner isLoading={isRegistering} message="Creating account, please wait..." />
      <View  style={$logoContainer}>
        <Image source={emsLogo} style={$logoImage} />
      </View>
      {errorMessage && <Text text={errorMessage} size="sm" weight="normal" style={$hint} />}

      <View style={{ marginTop: 40, flex: 2 }}>
        <TextField
          value={fullName}
          onChangeText={setFullName}
          containerStyle={$textField}
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect={false}
          keyboardType="default"
          labelTx="registerScreen.fullName"
          placeholderTx="registerScreen.fullNamePlaceholder"
          LabelTextProps={{ style: [$labelStyles] }}
          inputWrapperStyle={$inputWrapperStyle}
          style={$inputStyle}
          helper={fullNameError}
          status={fullNameError ? "error" : undefined}
          onSubmitEditing={() => authEmailInput.current?.focus()}
        />
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
          helper={authEmailError} // Pass the error message as the helper prop
          status={authEmailError ? "error" : undefined}
          onSubmitEditing={() => phoneNumberInput.current?.focus()}
        />
        
        {/* Phone Number */}
        <View style={{ marginBottom: 10 }}>
          <Text text="Phone Number" style={$labelStyles} />
          <PhoneInput
            ref={phoneInput}
            countryPickerProps={{
              countryCodes: ['US',"CA","GB"],
            }}
            defaultValue={phoneNumber}
            defaultCode="US"
            layout="second"
            onChangeText={(text) => {
              setPhoneNumber(text);
            }}
            onChangeFormattedText={(text) => {
              console.log("text",text);
            }}
            // autoFocus
            containerStyle={$phoneNumberContainerStyle}
            textContainerStyle={{ backgroundColor: '#FFFFFF', paddingVertical: 0 }}
            placeholder="Enter phone number"
            renderDropdownImage={<Icon icon="caretDown" size={34} />}
            countryPickerButtonStyle={{
              flexDirection: 'row-reverse',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          />
          {
            phoneNumberError ? <Text preset="formHelper" text={phoneNumberError} style={{ color: colors.error, marginVertical: 12 }} /> : null
          }
        </View>


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
          helper={passwordError}
          status={passwordError ? "error" : undefined}
          onSubmitEditing={register}
          RightAccessory={PasswordRightAccessory}
        />

        <Button
          testID="login-button"
          tx="registerScreen.register"
          style={$bigButton}
          textStyle={$bigButtonTextStyle}
          preset="reversed"
          onPress={register}
          disabled={isRegistering}
        />
      <View style={{alignSelf:'center', marginTop:20, flexDirection:'row',columnGap:9}}>
        <Text>Already have and account?</Text>
        <TouchableOpacity onPress={()=>navigation.navigate("Login")}>
          <Text style={{color:colors.ems.bigButton}}>Login</Text>
        </TouchableOpacity>
      </View>
      </View>
    </Screen>
  )
})

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
  justifyContent: 'center'
}
const $hint: TextStyle = {
  color: colors.tint,
  marginTop: 40
}

const $phoneNumberContainerStyle: ViewStyle = {
  borderBottomColor: colors.ems.borderColor,
  borderBottomWidth: 1,
  width: '100%',
  marginBottom: 0,
  paddingVertical: 0,
  flex: 1
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
  letterSpacing: 1
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
  resizeMode: 'contain',
}
