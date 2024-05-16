import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { TextStyle, View, ViewStyle } from "react-native"
import {
  Button,
  Header, Icon, Screen,
  Text,
} from "../../components"
import { colors, spacing } from "../../theme"
import { DemoTabScreenProps } from "app/navigators/DemoNavigator"
import { create } from "apisauce"
import { API_BASE_URL } from "app/utils/constants"
import { useStores } from "app/models"


interface AccountScreenProps extends DemoTabScreenProps<"Account"> { }

export const AccountScreen: FC<AccountScreenProps> = observer(function AccountScreen(
  _props,
) {

  const { navigation } = _props;
  const { authenticationStore: { authToken,logout } } = useStores();

  const api = create({baseURL: API_BASE_URL});

  const logoutUser = () => {
    api.get(`/logout?token=${authToken}`)
      .then(response => {
        logout();
      })
      .catch(error => {
        console.error('Error fetching receipts:', error);
        logout();
      });

  }


  return (
    <Screen
      preset="scroll"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["bottom"]}
    >
      <View>
        <Button text="Logout" textStyle={$btnTextStyle} style={$btnStyles} preset="filled" onPress={logoutUser} />
      </View>
    </Screen>

  )
})
const $btnStyles:ViewStyle={
  width:140,
  alignItems:'center',
  justifyContent:'center',
  minHeight:30
}
const $btnTextStyle:TextStyle={
  
}
const $screenContentContainer: ViewStyle = {
  flex:1,
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
  justifyContent: 'center',
  alignItems:'center'
}

const $titleContainer: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
};

const $titleText: TextStyle = {
  marginLeft: 14,
  color: colors.ems.redColor,
  fontSize: 16,
  lineHeight: 18,
  letterSpacing: 0.32,
};
