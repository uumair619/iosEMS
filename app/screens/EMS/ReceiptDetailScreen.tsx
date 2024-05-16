import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import { Image, ImageStyle, TextStyle, TouchableOpacity, View, ViewStyle, ScrollView } from "react-native"
import {
  Header, Icon, Spinner, // @demo remove-current-line
  Text
} from "../../components"
import { AppStackScreenProps } from "../../navigators" // @demo remove-current-line
import { colors, spacing } from "../../theme"
import { useStores } from "app/models"
import { create } from "apisauce"
import { API_ASSETS_URL, API_BASE_URL } from "app/utils/constants"
import { Receipt } from "app/utils/types"
import { useSafeAreaInsetsStyle } from "app/utils/useSafeAreaInsetsStyle"
import Toast from "react-native-root-toast"


interface ReceiptDetailScreenProps extends AppStackScreenProps<"ReceiptDetail"> { }

export const ReceiptDetailScreen: FC<ReceiptDetailScreenProps> = observer(function ReceiptDetailScreen(
  _props, // @demo remove-current-line
) {


  const { navigation, route: { params: { receiptId } } } = _props;
  const [receiptDetail, setReceiptDetail] = useState<Receipt>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(false);
  const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"])

  const {
    authenticationStore: { authToken },
  } = useStores();

  const api = create({
    baseURL: "https://ap.ugcinc.ca/ems/public/api",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });


  useEffect(() => {
    const getAllReceipts = () => {
      api
        .get<Receipt>(`/receipt/${receiptId}`)
        .then(response => {
          const responseData = response?.data.data;
          setReceiptDetail(responseData);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching receipts:', error);
          setLoading(false);
        });
    };
    getAllReceipts();
  }, []);


  if (loading) return <Spinner isLoading={loading || isDeleting} message={isDeleting ? "Deleting receipt please wait..." : "Receipt saving please wait..."} />


  const deleteReceipt = () => {
    setIsDeleting(true);
    api
      .delete(`/receipt/${receiptDetail?.id}`)
      .then(response => {

        Toast.show("Receipt deleted", {
          duration: Toast.durations.LONG,
          position: Toast.positions.CENTER
        });
        navigation.navigate("Demo", { screen: "Expenses" })
      })
      .catch(error => {
        console.error('Error while deleting receipt:', error);
      });

  }
  const imageUrl = "https://ap.ugcinc.ca/ems/public/" + receiptDetail?.attachment;

  return (
    <>
      <Header
        LeftActionComponent={
          <View style={$titleContainer}>
            <Icon
              icon="back"
              color={colors.ems.redColor}
              size={25}
              onPress={() => navigation.navigate("Demo", { screen: "Home" })}
            />
            <Text style={$titleText}>Receipt Details</Text>
          </View>
        }
        safeAreaEdges={["top"]}
        style={{ marginLeft: 12 }}
      />

      <View style={$container}>
        <View style={$topContainer}>
          <TouchableOpacity onPress={() => { navigation.navigate('Receipt', { imageUrl, isExpense: true }) }} style={$topContainer}>
            <Image
              source={{ uri: imageUrl }}
              style={$receiptImageStyle}
              resizeMode="cover" />
          </TouchableOpacity>
        </View>

        <View style={$middleContainer}>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={$receiptDateContainer}>
              <View style={{ width: '35%' }}>
                <Text>Supplier Name</Text>
              </View>
              <View style={$receiptLabelValueContainer}>
                <Text style={{ fontWeight: '700', fontSize: 16 }}>{receiptDetail?.merchant}</Text>
              </View>
            </View>

            {/* Category */}
            <View style={$otherInputTextContainer}>
              <View style={{ width: '35%' }}>
                <Text>Category</Text>
              </View>
              <View style={$receiptLabelValueContainer}>
                <Text style={{ fontWeight: '700', fontSize: 16 }}>{receiptDetail?.category}</Text>
              </View>
            </View>
             {/* project */}
             <View style={$otherInputTextContainer}>
              <View style={{ width: '35%' }}>
                <Text>Project Name</Text>
              </View>
              <View style={$receiptLabelValueContainer}>
                <Text style={{ fontWeight: '700', fontSize: 16 }}>{receiptDetail?.projectid}</Text>
              </View>
            </View>
            {/* Payment Method */}
            <View style={$otherInputTextContainer}>
              <View style={{ width: '35%' }}>
                <Text>Payment Method</Text>
              </View>
              <View style={$receiptLabelValueContainer}>
                <Text style={{ fontWeight: '700', fontSize: 16 }}>{receiptDetail?.payment_method}</Text>
              </View>
            </View>
            {/* Currency */}
            <View style={$otherInputTextContainer}>
              <View style={{ width: '35%' }}>
                <Text>Currency</Text>
              </View>
              <View style={$receiptLabelValueContainer}>
                <Text style={{ fontWeight: '700', fontSize: 16 }}>{receiptDetail?.currency}</Text>
              </View>
            </View>
            {/* Amount */}
            <View style={$otherInputTextContainer}>
              <View style={{ width: '35%' }}>
                <Text>Amount</Text>
              </View>
              <View style={$receiptLabelValueContainer}>
                <Text style={{ fontWeight: '700', fontSize: 16 }}>{receiptDetail?.amount}</Text>
              </View>
            </View>
 {/* submit date */}
 <View style={$otherInputTextContainer}>
              <View style={{ width: '35%' }}>
                <Text>Submit Date</Text>
              </View>
              <View style={$receiptLabelValueContainer}>
                <Text style={{ fontWeight: '700', fontSize: 16 }}>{receiptDetail?.created_at.substring(0,10)}</Text>
              </View>
            </View>

            {/* receipt date */}
            <View style={$receiptDateContainer}>
              <View style={{ width: '35%' }}>
                <Text>Receipt Date</Text>
              </View>
              <View style={$receiptLabelValueContainer}>
                <Text style={{ fontWeight: '700', fontSize: 16 }}>{receiptDetail?.date}</Text>
              </View>
            </View>


            {/* Description */}
            {
              receiptDetail?.description ? (
                <View style={{ flexDirection: 'column', marginTop: 24, columnGap: 10 }}>
                  <View style={{ width: '35%' }}>
                    <Text>Description</Text>
                  </View>
                  <View style={$descriptionTextContainer}>
                    <Text>
                      {receiptDetail?.description}
                    </Text>
                  </View>
                </View>
              ) : null
            }
          </ScrollView>

        </View>
        <View style={[$bottomContainer, $bottomContainerInsets]}>
          <TouchableOpacity style={[$receiptDeleteContainer]} onPress={deleteReceipt}>
            <Text style={$receiptDeleteText}>Delete Receipt</Text>
          </TouchableOpacity>

        </View>
      </View>
    </>
  )
})
const $descriptionTextContainer: ViewStyle = {
  width: '100%',
  marginTop: 20,
  borderStyle: 'dashed',
  borderWidth: 2,
  borderColor: '#979797',
  borderRadius: 5,
  padding: 5

}
const $receiptDateContainer: ViewStyle = { borderBottomColor: '#979797', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, columnGap: 10, borderBottomWidth: 2, borderStyle: 'dashed', paddingBottom: 10 }
const $receiptLabelValueContainer: ViewStyle = { width: '64%', justifyContent: 'flex-end', flexDirection: 'row', paddingRight: 10 }
const $otherInputTextContainer: ViewStyle = {
  flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15, columnGap: 10
}
const $inputContainerStyle: ViewStyle = {
  width: '100%',
}
const $inputWrapperStyle: ViewStyle = {
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  borderStyle: 'dashed',
  paddingHorizontal: 10,
  borderColor: '#979797',
  borderWidth: 2
}

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
}

const $topContainer: ViewStyle = {
  flexShrink: 1,
  flexGrow: 1,
  flexBasis: "30%",
  justifyContent: "center",
  alignItems: 'center',
  backgroundColor: colors.ems.redColor,
}
const $middleContainer: ViewStyle = {
  flexShrink: 1,
  flexGrow: 0,
  flexBasis: "70%",
  backgroundColor: colors.palette.neutral100,
  paddingHorizontal: spacing.lg,
}

const $bottomContainer: ViewStyle = {
  flexShrink: 1,
  flexGrow: 0,
  flexBasis: "15%",
  backgroundColor: colors.palette.neutral100,
  paddingHorizontal: spacing.lg,
}

const $receiptImageStyle: ImageStyle = { height: 150, width: 260, overflow: 'hidden', marginTop: 20, }
const $receiptDeleteContainer: ViewStyle = {
  width: '100%',
  height: 40,
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 10,
  marginBottom: 10,
}
const $receiptDeleteText: TextStyle = {
  color: colors.ems.redColor,
  fontWeight: '500',
  fontSize: 14,
  lineHeight: 18,
  letterSpacing: 0.28,
  fontStyle: 'normal'

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
