/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  NavigatorScreenParams, // @demo remove-current-line
} from "@react-navigation/native"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import { observer } from "mobx-react-lite"
import React, { useEffect, useState } from "react"
import { useColorScheme } from "react-native"
import * as Screens from "app/screens"
import Config from "../config"
import { useStores } from "../models" // @demo remove-current-line
import { DemoNavigator, DemoTabParamList } from "./DemoNavigator" // @demo remove-current-line
import { navigationRef, useBackButtonHandler } from "./navigationUtilities"
import { colors } from "app/theme"
import { NoInternetConnection } from '../components'
import NetInfo from '@react-native-community/netinfo';

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 *   https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type AppStackParamList = {
  Welcome: undefined
  Login: undefined // @demo remove-current-line
  Demo: NavigatorScreenParams<DemoTabParamList> // @demo remove-current-line
  // 🔥 Your screens go here
  // IGNITE_GENERATOR_ANCHOR_APP_STACK_PARAM_LIST

  // EMS screen
  Register: undefined
  ReceiptDetail: { receiptId?:number }
  Receipt: { imageUrl?: string, isExpense?: boolean }
  NoInternet: undefined
  ReceiptCreate: { imageUrl?: string,merchant?:string,date?:string,amount?:string,currency?:string,payment_method?:string,category?:string }
}

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes

export type AppStackScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<
  AppStackParamList,
  T
>

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<AppStackParamList>()

const AppStack = observer(function AppStack() {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    // Check network connectivity when the component mounts and on network changes
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    // Clean up the subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  // @demo remove-block-start
  const {
    authenticationStore: { isAuthenticated },
  } = useStores()
  
  // @demo remove-block-end
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, navigationBarColor: colors.background }}
      initialRouteName={isAuthenticated ? "Demo" : "Welcome"}
    >
      {/* @demo remove-block-start */}
      {
        isAuthenticated ? (
          <>
            {
              isConnected ? (
                <>
                  <Stack.Screen name="Demo" component={DemoNavigator} />
                  <Stack.Screen name="ReceiptCreate" component={Screens.ReceiptCreateScreen} />
                  <Stack.Screen name="Receipt" component={Screens.ReceiptScreen} />
                  <Stack.Screen name="ReceiptDetail" component={Screens.ReceiptDetailScreen} />
                </>
              ) : (
                <Stack.Screen name="NoInternet" component={NoInternetConnection} />
              )
            }
          </>
        ) : (
          <>
            {
              isConnected ? (
                <>
                  <Stack.Screen name="Welcome" component={Screens.WelcomeScreen} />
                  <Stack.Screen name="Login" component={Screens.LoginScreen} />
                  <Stack.Screen name="Register" component={Screens.RegisterScreen} />
                </>
              ) : (
                <Stack.Screen name="NoInternet" component={NoInternetConnection} />
              )
            }
          </>
        )}
      {/* @demo remove-block-end */}
      {/** 🔥 Your screens go here */}
      {/* IGNITE_GENERATOR_ANCHOR_APP_STACK_SCREENS */}
    </Stack.Navigator>
  )
})

export interface NavigationProps
  extends Partial<React.ComponentProps<typeof NavigationContainer>> { }

export const AppNavigator = observer(function AppNavigator(props: NavigationProps) {
  const colorScheme = useColorScheme()

  useBackButtonHandler((routeName) => exitRoutes.includes(routeName))

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      {...props}
    >
      <AppStack />
    </NavigationContainer>
  )
})
