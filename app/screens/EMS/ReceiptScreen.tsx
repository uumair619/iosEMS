import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { Image, ImageStyle, Text, TextStyle, View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "../../navigators"
import { colors, spacing } from "../../theme"
import { Header, Icon } from "app/components"


interface ReceiptScreenProps extends AppStackScreenProps<"Receipt"> { }

export const ReceiptScreen: FC<ReceiptScreenProps> = observer(function ReceiptScreen(
    _props, // @demo remove-current-line
) {

    const { navigation, route:{params:{imageUrl,isExpense}} } = _props;
    return (
        <>
            <Header
                LeftActionComponent={<View style={$titleContainer}>
                    <Icon
                        icon="back"
                        color={colors.ems.redColor}
                        size={25}
                        onPress={() => navigation.goBack()} />
                    <Text style={$titleText}>Receipt</Text>
                </View>}
                safeAreaEdges={["top"]}
                style={{ marginLeft: 12 }} />
            <View style={$container}>
                <View style={$logoContainer}>
                    <Image source={{uri:isExpense ? imageUrl : `data:image/jpg;base64,${imageUrl}`}} style={$logoImage} />
                </View>
            </View>
        </>
    )
})

const $container: ViewStyle = {
    flex: 1,
    paddingHorizontal: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.ems.lightRedColor,
}
const $logoContainer: ViewStyle = {
    alignItems: 'center',
    justifyContent: 'center',
    width: 370,
    height: 592,
    paddingHorizontal:17
}
const $logoImage: ImageStyle = {
    width: '100%',
    height: '100%',
    resizeMode:'contain'
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