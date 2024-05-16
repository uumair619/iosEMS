import { observer } from "mobx-react-lite";
import React, { FC, useEffect, useState } from "react";
import { Pressable, StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle, Platform } from "react-native";
import { Card, Icon, Screen, Text, Scanner, TopBanner, Spinner } from "../../components";
import { colors, spacing } from "../../theme";
import { DemoTabScreenProps } from "app/navigators/DemoNavigator";
import { RFValue } from "react-native-responsive-fontsize";
import { FlatGrid } from 'react-native-super-grid';
import { Receipt } from "app/utils/types";
import { useStores } from "app/models";
import { API_BASE_URL } from "app/utils/constants";
import { create } from "apisauce";
import { useIsFocused } from "@react-navigation/native";
import { calculateTotalAmount, truncateText } from "app/utils/helper";
import moment from "moment";


interface HomeScreenProps extends DemoTabScreenProps<"Home"> { }


export const HomeScreen: FC<HomeScreenProps> = observer(function HomeScreen(_props) {
    const { navigation } = _props;
    const isFocused = useIsFocused();
    const { authenticationStore: { authToken } } = useStores();

    const [scannerVisible, setScannerVisible] = useState(false);
    const [receiptsData, setReceiptsData] = useState<Receipt[]>([]);
    const [loading, setLoading] = useState(true);


    const closeScanner = () => {
        setScannerVisible(false);
    };

    const api = create({
        baseURL: "https://ap.ugcinc.ca/ems/public/api",
        headers: {
            Authorization: `Bearer ${authToken}`,
        },
    });
    
    useEffect(() => {
        if(isFocused) {
            loadReceipts();
        }
    }, [isFocused]);

    const loadReceipts = () => {
        api
            .get<Receipt[]>("/receipt?filter=today")
            .then((response) => {
                
                console.log("Response: h", response);
                const responseData = response?.data?.data;
                setReceiptsData(responseData);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching receipts:", error);
                setLoading(false);
            });
    };

    const handleImageCapture = (imageUri: string | null) => {
        console.log('Captured Image URI:', imageUri);
    };

    if (loading) {
        return <Spinner isLoading={loading} message="Loading dashboard, please wait.." />
    }

    const goToScan = () => {

        navigation.navigate("Demo", { screen: 'DemoCommunity' })
    }


    const uploadReceipComponent = (
        <TouchableOpacity
            onPress={goToScan}
            style={[$receiptUploadContentWrapperStyle, $uploadedContent, {
                justifyContent: 'flex-end',
                alignItems: 'center',
                backgroundColor: '#F3F5F5',
                paddingVertical: 10,
                borderRadius: 10
            }]}>
            <View style={$receiptUploadCameraCircle}>
                <Icon icon="cameraOutline" color="gray" />
            </View>
            <View style={{ marginTop: 5 }}>
                <Text style={$uploadReceiptText}>Upload</Text>
                <Text style={$uploadReceiptText}>Receipt</Text>
            </View>
        </TouchableOpacity>
    );
  

    const renderTodayExpenditureComponent = (data: Receipt) => {
        console.log("🚀 ~ file: HomeScreen.tsx:102 ~ renderTodayExpenditureComponent ~ data:", data)
        return (
            <TouchableOpacity
                onPress={() => navigation.navigate("ReceiptDetail", { receiptId: data?.id })}
                style={[$receiptUploadContentWrapperStyle, $uploadedContent]}>
                <Text style={{ textAlign: 'left' }}>{moment(data?.created_at).format("MMM D")}</Text>
                <View style={{ marginTop: 35 }}>
                    <Text style={{
                        color: colors.ems.customTextColor,
                        fontSize: RFValue(18),
                        fontWeight: '500',
                        letterSpacing: -0.4
                    }}>{data.amount}</Text>
                    <Text style={[$uploadReceiptText, { textAlign: 'left', fontSize: RFValue(10) }]}>{truncateText(data.category, 12)}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <Screen
            preset="auto"
            contentContainerStyle={$screenContentContainer}
            safeAreaEdges={["top", "bottom"]}
        >
            <Scanner navigation={navigation} visible={scannerVisible} onClose={closeScanner} onImageCapture={handleImageCapture} containerStyle={$scannerContainer} />
            <View style={$container}>
                <TopBanner amountTotal={calculateTotalAmount(Array.isArray(receiptsData) ? receiptsData : [])} />
                <View style={$bottomContainer}>
                    <Text tx="homeScreen.receipts" preset="subheading" style={$receiptTitle} />
                    <FlatGrid
                        itemDimension={95}
                        data={(Array.isArray(receiptsData) && receiptsData.length > 0 ? [...Array(receiptsData.length+1).keys()] : [0])}
                        style={styles.gridView}
                        fixed
                        spacing={7.5}
                        renderItem={({ item }) => {
                            console.log("🚀 ~ file: HomeScreen.tsx:122 ~ HomeScreen ~ item:", item);

                            return item === 0 ? (
                                uploadReceipComponent
                            ) : (
                                <View style={[styles.itemContainer, { backgroundColor: "#FFFFFF"}]}>
                                    {renderTodayExpenditureComponent(receiptsData[item - 1])}
                                </View>
                            );
                        }}
                    />


                </View>
            </View>
        </Screen>
    )
})
const styles = StyleSheet.create({
    gridView: {
        marginTop: 10,
        flex: 1,
    },
    itemContainer: {
        justifyContent: 'flex-end',
        borderRadius: 5,
        paddingHorizontal: 9,
        paddingVertical: 10,
        elevation: 1,
        ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 2,
            },
          }),
    },
    itemName: {
        fontSize: RFValue(16),
        color: '#fff',
        fontWeight: '600',
    },
    itemCode: {
        fontWeight: '600',
        fontSize: RFValue(12),
        color: '#fff',
    },
});

const $scannerContainer: ViewStyle = {}
const $uploadedContent: ViewStyle = {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
}


const $screenContentContainer: ViewStyle = {

}

const $container: ViewStyle = {
    flex: 1,
    backgroundColor: colors.background,

}

const $bottomContainer: ViewStyle = {
    flexShrink: 1,
    flexGrow: 0,
    flexBasis: "53%",
    backgroundColor: colors.palette.neutral100,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 22,
    justifyContent: "space-around",
}

const $receiptTitle: TextStyle = {
    color: colors.ems.customTextColor,
    fontSize: RFValue(23),
    fontStyle: 'normal',
    fontWeight: "600",
    letterSpacing: 0.64,
    marginTop: 24,
    marginLeft: 5
}
const $uploadReceiptText: TextStyle = {
    color: colors.ems.customTextColor,
    fontSize: RFValue(13),
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: 22,
    textAlign: 'center'
}

const $receiptUploadCameraCircle: ViewStyle = {
    width: 41,
    height: 41,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: "gray",
    borderWidth: 1
}
const $receiptUploadContentWrapperStyle: ViewStyle = {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
}
