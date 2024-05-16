import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import { Image, ImageStyle, TextStyle, View, ViewStyle, RefreshControl, FlatList, StatusBar } from "react-native"
import { Card, Screen, Spinner, Text, VoiceSearchFilter } from "../../components"
import { colors, spacing } from "../../theme"
import { DemoTabScreenProps } from "app/navigators/DemoNavigator"
import { create } from 'apisauce'
import { useStores } from "app/models"
import { API_ASSETS_URL, API_BASE_URL } from "app/utils/constants"
import { Receipt } from "app/utils/types";
import moment from "moment"
import { RFValue } from "react-native-responsive-fontsize"
import { useSafeAreaInsetsStyle } from "app/utils/useSafeAreaInsetsStyle"
import { useIsFocused } from "@react-navigation/native"

interface ExpensesScreenProps extends DemoTabScreenProps<"Expenses"> { }


export const ExpensesScreen: FC<ExpensesScreenProps> = observer(function ExpensesScreen(_props) {
    const isFocused = useIsFocused();
    const { navigation } = _props
    const [searchKeyWord, setSearchKeyword] = useState('');
    const { authenticationStore: { authToken } } = useStores();
    const [receipts, setReceipts] = useState<Receipt[]>([]);
    const [loading, setLoading] = useState(true);
    const [filteredReceipts, setFilteredReceipts] = useState<Receipt[]>([]);
    const [refreshing, setRefreshing] = useState(false);

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
            .get<Receipt[]>("/receipt")
            .then((response) => {
                const responseData = response?.data?.data;
                console.log("Response: ", response);
                setReceipts(responseData);
                setLoading(false);
                setRefreshing(false);
            })
            .catch((error) => {
                console.error("Error fetching receipts:", error);
                setLoading(false);
                setRefreshing(false);
            });
    };


    if (loading) {
        return <Spinner isLoading={loading} message="Loading receipts, please wait.." />
    }

    const onRefresh = () => {
        // Trigger the refresh action
        console.log("Refresh")
        loadReceipts();
    };

    const voiceSearch = (keyword) => {
        setSearchKeyword(keyword);
        filterReceipts(keyword);
    };

    const filterReceipts = (keyword) => {
        const filtered = receipts?.filter((item) =>
            item.category.toLowerCase().includes(keyword.toLowerCase())
        ) || [];
        console.log("🚀 ~ file: ExpensesScreen.tsx:76 ~ filterReceipts ~ receipts:", receipts)
        setFilteredReceipts(filtered);
    };


    const renderReceipts = searchKeyWord ? filteredReceipts : receipts;
    console.log("🚀 ~ file: ExpensesScreen.tsx:82 ~ ExpensesScreen ~ searchKeyWord:", searchKeyWord)

    const groupedReceipts = {};
    renderReceipts?.forEach((item) => {
        const formattedDate = moment(item.date).format('MMMM DD');
        if (!groupedReceipts[formattedDate]) {
            groupedReceipts[formattedDate] = [];
        }
        groupedReceipts[formattedDate].push(item);
    });

    const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"])
    const $topContainerInsets = useSafeAreaInsetsStyle(["top"])

    return (
        <>
            <StatusBar barStyle="dark-content" />
            <View style={$container}>
                <View style={[$topContainer, $topContainerInsets]}>
                    <VoiceSearchFilter onSearch={voiceSearch} />
                </View>

                <View style={[$bottomContainer, $bottomContainerInsets]}>

                    {Object.keys(groupedReceipts).length === 0 ? (
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            <View style={{ alignItems: 'center', gap: 30 }}>
                                <Image
                                    source={require("../../../assets/images/no-receipt.png")}
                                    style={{ width: 150, height: 150 }}
                                />
                                <Text style={$noReceiptsText}>No receipt exists</Text>
                            </View>
                        </View>
                    ) : (
                        <FlatList
                            data={Object.keys(groupedReceipts)}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <>
                                    <Text style={{ marginTop: 15 }}>{item}</Text>
                                    {groupedReceipts[item].map((item, index, array) => {
                                        const isLastItem = index === array.length - 1;
                                        return (
                                            <Card
                                                key={index}
                                                ContentComponent={
                                                    <View style={$rowContainer}>
                                                        <View style={$receiptContainer}>
                                                            <Image source={{ uri: API_ASSETS_URL + item?.attachment }} style={$receiptImage} />
                                                        </View>
                                                        <View style={$detailsContainer}>
                                                            <View style={{ flexDirection: "row" }}>
                                                                <View style={{ flex: 1 }} />
                                                                <View style={$categoryContainer}>
                                                                    <Text style={$categoryText}>{item?.category}</Text>
                                                                </View>
                                                            </View>
                                                            <View>
                                                                <Text style={{ color: colors.ems.customTextColor, fontSize: RFValue(12), fontWeight: "400" }}>
                                                                    {item?.merchant}
                                                                </Text>
                                                                <Text
                                                                    style={{ color: colors.ems.customTextColor, fontSize: RFValue(16), fontWeight: "400", lineHeight: 32, letterSpacing: -0.32 }}
                                                                >
                                                                    {item?.amount}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                }
                                                style={[$cardStyles, isLastItem ? { marginBottom: 15 } : null]}
                                                onPress={() => navigation.navigate("ReceiptDetail", { receiptId: item?.id })}
                                            />
                                        );
                                    })}
                                </>
                            )}
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />

                    )
                    }
                </View>
            </View>
        </>
    );

})


const $rowContainer: ViewStyle = {
    flexDirection: 'row',
    overflow: 'hidden',
};

const $receiptContainer: ViewStyle = {
    width: 66,
    height: 90,
    overflow: 'hidden',
};

const $receiptImage: ImageStyle = {
    width: '100%',
    height: '100%',
    marginTop: 5,
    marginLeft: 5,
    borderRadius: 10
};

const $detailsContainer: ViewStyle = {
    marginLeft: 15,
    flexDirection: 'column',
    justifyContent: "center",
    flex: 1,
    rowGap: 10,
};

const $categoryContainer: ViewStyle = {
    height: 18,
    borderWidth: 1,
    paddingHorizontal: 11,
    borderRadius: 13,
    borderColor: colors.ems.borderColor,
    marginTop: 10,
    alignItems: "center",
    justifyContent: 'center',
    marginRight: 22,

};

const $categoryText: TextStyle = {
    color: colors.ems.customTextColor,
    fontSize: RFValue(10),
    fontWeight: '400',
    lineHeight: 16,
    letterSpacing: -0.2,
   
};




const $cardStyles: ViewStyle = {
    elevation: 0,
    height: 90,
    padding: 0,
    marginTop: 10,
}

const $noReceiptsText: TextStyle = {
    fontSize: RFValue(19),
    fontWeight: 'bold',
    color: colors.ems.bigButton,
    textAlign: "center"
};


const $container: ViewStyle = {
    flex: 1,
    backgroundColor: colors.background,
}

const $topContainer: ViewStyle = {
    flexShrink: 1,
    flexGrow: 1,
    flexBasis: "15%",
    justifyContent: "center",
    paddingHorizontal: 13,
}

const $bottomContainer: ViewStyle = {
    flexShrink: 1,
    flexGrow: 0,
    flexBasis: "85%",
    backgroundColor: colors.palette.neutral100,
    paddingHorizontal: 13,
    // borderWidth: 1
    // justifyContent: "space-around",
}
