import React from "react";
import { TextStyle, View, ViewStyle } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "../Text";
import { Card } from "../Card";
import { colors, spacing, typography } from "app/theme";
import { RFValue } from "react-native-responsive-fontsize";
import { useStores } from "app/models";
import { useSafeAreaInsetsStyle } from "app/utils/useSafeAreaInsetsStyle";

interface TopBannerProps {
    amountTotal?: number;
}

export function TopBanner(props: TopBannerProps) {
    const { amountTotal, ...rest } = props;
    const {
        authenticationStore: { user },
    } = useStores()
    const safeAreaInsets = useSafeAreaInsetsStyle(["top"]);

    return (
        <LinearGradient
            colors={['#F69D34', '#EFE60B']}
            style={[$topContainer, safeAreaInsets]}
        >
            <View>
                <Text style={$titleText} preset="heading">Welcome back, {user?.name}!</Text>
            </View>

            <View style={$cardContentWrapper}>
                <Card
                    ContentComponent={
                        <View style={[$cardContent]}>
                            <Text style={$cardText}
                                tx="homeScreen.expenditure"
                                preset="subheading" />
                            <View style={$amountWrapper}>
                                <View style={$dollarSignContainer}>
                                    <Text style={$dollarSign}>$</Text>
                                </View>
                                <View>
                                    <Text style={$cardAmount}> {amountTotal}</Text>
                                </View>
                            </View>
                        </View>
                    }
                    style={$cardStyle}
                />
                <View style={$cardShadow} />
            </View>

        </LinearGradient>
    )

}
const $cardContentWrapper: ViewStyle = {
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'relative',
    paddingBottom: 38
}
const $dollarSignContainer: ViewStyle = {
    position: 'absolute',
    top: 10,
    left: 0,
    bottom: 0
}
const $amountWrapper: ViewStyle = {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
}
const $topContainer: ViewStyle = {
    flexShrink: 1,
    flexGrow: 1,
    flexBasis: "57%",
    justifyContent: "center",
    paddingHorizontal: 27
}
const $titleText: TextStyle = {
    color: colors.palette.neutral200,
    fontSize: RFValue(30),
    fontStyle: 'normal',
    fontWeight: "600",
    letterSpacing: 0.65
}
const $cardContent: ViewStyle = {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30
}
const $cardText: TextStyle = {
    color: colors.ems.redColor,
    fontSize: RFValue(14),
    fontStyle: 'normal',
    fontWeight: "700",
    textTransform: 'uppercase',


}
const $cardShadow: ViewStyle = {
    backgroundColor: "#F67A34",
    height: 15,
    borderBottomEndRadius: 6,
    borderBottomStartRadius: 6,
    marginHorizontal: 4
};

const $cardStyle: ViewStyle = {
    borderRadius: 6,
    marginTop: 30,
    backgroundColor: colors.palette.neutral100,
    borderWidth: 0,
    elevation: 0,
};
const $dollarSign: TextStyle = {
    fontSize: RFValue(20),
    fontWeight: 'bold',
    color: colors.ems.redColor,
    paddingLeft: 5,
};

const $cardAmount: TextStyle = {
    fontSize: RFValue(30),
    lineHeight: 49,
    fontWeight: 'bold',
    color: colors.ems.redColor,
    marginLeft: 15
};
const $amountContainer: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15
}

const $container: ViewStyle = {
    flex: 1,
    backgroundColor: colors.background,

}
