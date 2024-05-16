import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useRef, useState } from "react"
import { Platform, Dimensions, Image, ImageStyle, StyleSheet, TextInput, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import {
  Header, Icon, Screen, Spinner, // @demo remove-current-line
  Text,
  TextField,
} from "../../components"
import { AppStackScreenProps } from "../../navigators" // @demo remove-current-line
import { colors, spacing, typography } from "../../theme"
import { API_BASE_URL, COUNTRIES_CURRENCY_CODE, RANDOM_CATEGORIES, RANDOM_METHODS_OF_PAYMENT } from "app/utils/constants"
import { useStores } from "app/models"
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import { create } from "apisauce"
import Toast from 'react-native-root-toast'
import { RFValue } from "react-native-responsive-fontsize"
import RNPickerSelect from 'react-native-picker-select';


import axios from 'axios';

interface ReceiptCreateScreenProps extends AppStackScreenProps<"ReceiptCreate"> { }

const dropdownWidth = Dimensions.get("window").width;
const borderBottomColor = "rgba(0,0,0,0.2)";

export const ReceiptCreateScreen: FC<ReceiptCreateScreenProps> = observer(function ReceiptCreateScreen(
  _props, // @demo remove-current-line
) {


  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const { navigation, route: { params: {
    imageUrl,
    amount: totalAmount,
    currency: currencyType,
    date: selectDate,
    merchant,
    payment_method,
    category: categoryOveride
  } } } = _props;
  
  const DATE_FORMAT = { month: 'short', day: '2-digit', year: 'numeric' };
  const currentDate = new Date().toLocaleDateString('en-US', DATE_FORMAT);
  console.log("🚀 ~ file: ReceiptCreateScreen.tsx:40 ~ selectDate:", payment_method)


  const phoneNumberInput = useRef<TextInput>();



  const [isSubmitted, setIsSubmitted] = useState(false);

  const [mercant, setMercant] = useState(merchant === 'Merchant 1' ? "Supplier 1" : merchant || "");
  const [date, setDate] = useState(selectDate === 'Oct 5, 2000' ? currentDate : selectDate || "");
  const [amount, setAmount] = useState(totalAmount || '');
  const [description, setDescription] = useState("");
  const [date2, setDate2] = useState(currentDate);
  const [category, setCategory] = useState(categoryOveride || '');
  const [methodOfPayment, setMethodOfPayment] = useState(payment_method === 'CRYPTOCURRENCY' ? "debit_card" : payment_method || "");
  const [currency, setCurrency] = useState(currencyType === 'USD' ? "CAD" : currencyType || "");


  const [selectedDateField, setSelectedDateField] = useState("");
  const [base64Image, setBase64Image] = useState(null);

  const [loading, setLoading] = useState(false);

  const [projectCodes, setProjectCodes] = useState([]);
  const [selectedProjectCode, setSelectedProjectCode] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    fetchProjectCodes();
  }, []);

  const fetchProjectCodes = async () => {
    try {
      console.log("user"+JSON.stringify(user));
      const response = await fetch('https://ap.ugcinc.ca/ems/public/api/project-codes');
      const data = await response.json();
      setProjectCodes(data);
      if (Array.isArray(data) && data.length > 0) {
        setSelectedProjectCode(data[0].projectCodeId); // Select the first project code by default
      }
      
    } catch (error) {
      console.error('Error fetching project codes:', error);
    }
  };

  const {
    authenticationStore: { validationError, authToken },
  } = useStores();
  const { authenticationStore } = useStores();
  const { user } = authenticationStore;
  const api = create({
    baseURL: "https://ap.ugcinc.ca/ems/public/api",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  useEffect(() => {
    const base64Data = "data:image/png;base64," + imageUrl;
    setBase64Image(base64Data);
  }, [imageUrl]);

  const error = isSubmitted ? validationError : ""


  const showDatePicker = (fieldName) => {
    setSelectedDateField(fieldName);
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    const formattedDate = moment(date).format("MMM DD, YYYY");

    if (selectedDateField === "date") {
      setDate(formattedDate);
    } else if (selectedDateField === "date2") {
      setDate2(formattedDate);
    }

    hideDatePicker();
  };

  const resetData = () => {
    setMercant('');
    setDate('');
    setAmount('');
    setDescription('');
    setDate2('');
    setCategory('');
    setMethodOfPayment('');
    setCurrency('');
    setSelectedDateField('');
    setBase64Image(null);
  }



  const storeReceipt = async () => {
    setLoading(true);
    const formattedDate = moment(date, 'MMM DD, YYYY').format('DD-MM-YYYY');
    try {
      const response = await api.post('/receipt', JSON.stringify({
        merchant: mercant,
        date: formattedDate,
        amount,
        currency,
        category,
        payment_method: methodOfPayment,
        attachment: base64Image,
        projectid: selectedProjectCode,
        userid: user.id
      }));
      const message = response?.data?.success;
      console.log("🚀 ~ file: ReceiptCreateScreen.tsx:140 ~ storeReceipt ~ response:", response?.data)

      if (message) {
        // Display a toast message

        Toast.show("Receipt created successfully", {
          duration: Toast.durations.LONG,
          position: Toast.positions.CENTER
        });


        // Reset the states
        resetData()
        // Navigate to the "Demo" screen with "Scan" route
        navigation.navigate('Demo', { screen: 'Scan' });
      }
      console.log("response data: ", response?.data);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  function capitalizeFirstLetter(inputString: string) {
    return inputString?.charAt(0)?.toUpperCase() + inputString?.slice(1).toLowerCase();
  }



  if (loading) return <Spinner isLoading={loading} message="Saving receipt, please wait..." />

  return (
    <>
      <Header
        LeftActionComponent={
          <View style={$titleContainer}>
            <Icon
              icon="back"
              color={colors.ems.redColor}
              size={25}
              onPress={
                () => {
                  resetData();
                  navigation.navigate("Demo", { screen: "Home" })
                }
              }
            />
            <Text style={$titleText}>Receipt Details</Text>
          </View>
        }
        safeAreaEdges={["top"]}
        style={{ marginLeft: 12 }}
      />

      <Screen
        preset="auto"
        style={$screenContainer}
        safeAreaEdges={["bottom"]}
      >
        <TouchableOpacity onPress={() => { navigation.navigate('Receipt', { imageUrl }) }} style={$topContainer}>
          <Image
            source={{ uri: `data:image/jpg;base64,${imageUrl}` }}
            style={$receiptImageStyle}
            resizeMode="contain" />
        </TouchableOpacity>

        <View style={$bottomContainer}>
          <View>
            <View>
              <TextField
                value={mercant}
                onChangeText={setMercant}
                containerStyle={[$textField]}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                labelTx="receiptDetailScreen.supplier"
                placeholderTx="receiptDetailScreen.supplierPlaceholder"
                LabelTextProps={{ style: [$labelStyles] }}
                inputWrapperStyle={$inputWrapperStyle}
                style={$inputStyle}
                helper={error}
                status={error ? "error" : undefined}
              // onSubmitEditing={() => authEmailInput.current?.focus()}
              />
            </View>
            <View>
              <Text text="Invoice Date" style={$labelStyles} />
              <TouchableOpacity onPress={() => showDatePicker("date")}
                style={$dateOneContainerStyles}>
                {
                  date ? <Text >{date}</Text> : <Text tx="receiptDetailScreen.datePlaceholder" style={{ paddingBottom: 5 }} />
                }
              </TouchableOpacity>
            </View>

            {/* Currency and total */}
            <View
              style={{
                marginTop: 20,
                flexDirection: "row",
                alignItems: 'center',
                columnGap: 10,
                width: dropdownWidth * 0.81,

              }}>
              {/* left */}
              <View style={{ width: 110 }}>

                <Text style={{
                  fontSize: RFValue(16),
                }}>Currency</Text>

                <RNPickerSelect
                  value={currency}
                  onValueChange={(itemValue) => {
                    setCurrency(itemValue);
                    console.log("Item Selected", itemValue)
                  }}
                  items={COUNTRIES_CURRENCY_CODE}
                  style={{
                    ...pickerSelectStyles,
                    iconContainer: {
                      top: 10,
                      right: 0,
                    }
                  }}
                  useNativeAndroidPickerStyle={false}
                  // @ts-ignore
                  Icon={() => {
                    return <Icon icon="caretDown" size={30} color="#0D135A" />;
                  }}
                />
              </View>
              {/* Rigth */}
              <View style={{ flex: 2 }}>

                <Text style={{
                  fontSize: RFValue(16),
                }}>Total</Text>
                <TextField
                  ref={phoneNumberInput}
                  value={amount}
                  onChangeText={setAmount}
                  containerStyle={[$textField, { marginBottom: 0 }]}
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect={false}
                  keyboardType="email-address"
                  textAlignVertical="top"
                  placeholderTx="receiptDetailScreen.totalPlaceholder"
                  LabelTextProps={{ style: [$labelStyles] }}
                  inputWrapperStyle={[$inputWrapperStyle, {
                    borderBottomWidth: 2,
                    marginTop: 3,
                    borderBottomColor: borderBottomColor
                  }]}
                  style={[$inputStyle]}
                />

              </View>
            </View>
            {/* Project */}

            <View
            style={{
              marginTop: 20

            }}>
            <Text text="Select Project" style={$labelStyles} />
      {projectCodes.length > 0 && (
        <RNPickerSelect
          onValueChange={(value) => setSelectedProjectCode(value)}
          items={projectCodes.map((projectCode) => ({
            label: projectCode.name,
            value: projectCode.name, // Assuming projectCodeId is the key for the project code
          }))}
          value={selectedProjectCode}
          style={{
            ...pickerSelectStyles2,
            iconContainer: {
              top: 10,
              right: 0,
            }
          }}
          useNativeAndroidPickerStyle={false}
          // @ts-ignore
          Icon={() => {
            return <Icon icon="caretDown" size={30} color="#0D135A" />;
          }}
          placeholder={{}}
        />
      )}
    </View>

            {/* Description */}
            <View style={{ marginTop: 20 }}>
              <TextField
                value={description}
                onChangeText={setDescription}
                containerStyle={$textField}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="default"
                labelTx="receiptDetailScreen.description"
                LabelTextProps={{ style: [$labelStyles] }}
                inputWrapperStyle={[$inputWrapperStyle, { minHeight: 40 }]}
                style={$inputStyle}
                helper={error}
                status={error ? "error" : undefined}
                // onSubmitEditing={() => authEmailInput.current?.focus()}
                multiline
                numberOfLines={1}
              />
            </View>
            {/* Dates */}
            <View>
              <Text text="Submit Date" style={$labelStyles} />
              <TouchableOpacity onPress={() => showDatePicker("date2")}
                style={{ borderBottomWidth: 1, minHeight: 30, width: '100%', marginTop: 10, borderBottomColor: borderBottomColor, paddingBottom: 5 }}>
                {
                  date2 ? <Text >{date2}</Text> : <Text tx="receiptDetailScreen.datePlaceholder" style={{ paddingBottom: 5 }} />
                }
              </TouchableOpacity>
            </View>
            {/* Category */}
            <View style={{ marginTop: 12 }}>
              <Text style={{
                fontSize: RFValue(16),
              }}>Category</Text>

              <RNPickerSelect
                value={capitalizeFirstLetter(category)}
                onValueChange={(itemValue) => setCategory(itemValue)}
                items={RANDOM_CATEGORIES}
                style={{
                  ...pickerSelectStyles,
                  iconContainer: {
                    top: 10,
                    right: 0,
                  }
                }}
                useNativeAndroidPickerStyle={false}
                // @ts-ignore
                Icon={() => {
                  return <Icon icon="caretDown" size={30} color="#0D135A" />;
                }}
              />
            </View>

            {/* Payments */}
            <View style={{ marginTop: 12 }}>
              <Text style={{
                fontSize: RFValue(16),
              }}>Method of Payment</Text>

              <RNPickerSelect
                value={methodOfPayment.toLowerCase()}
                onValueChange={(itemValue) => setMethodOfPayment(itemValue)}
                items={RANDOM_METHODS_OF_PAYMENT}
                style={{
                  ...pickerSelectStyles,
                  iconContainer: {
                    top: 10,
                    right: 0,
                  }
                }}
                useNativeAndroidPickerStyle={false}
                // @ts-ignore
                Icon={() => {
                  return <Icon icon="caretDown" size={30} color="#0D135A" />;
                }}
              />
            </View>

            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />

            <TouchableOpacity style={$receiptDeleteContainer} onPress={storeReceipt}>
              <Text style={$receiptDeleteText}>Save</Text>
              {/* <Text style={$receiptDeleteText}>Delete Receipt</Text> */}
            </TouchableOpacity>
          </View>

        </View>

      </Screen>
    </>
  )
})

const $dateOneContainerStyles: ViewStyle = { borderBottomWidth: 1, marginTop: 6, minHeight: 30, width: '100%', borderBottomColor: borderBottomColor, paddingBottom: 5 }
const $receiptImageStyle: ImageStyle = { height: 200, width: 260, overflow: 'hidden', marginTop: 20, }
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
const $textField: ViewStyle = {
  marginBottom: spacing.lg,
}

const $labelStyles: TextStyle = {
  color: colors.ems.inputLabel,
  fontFamily: typography.fonts.lato.normal,
}

const $inputWrapperStyle: ViewStyle = {
  borderWidth: 0,
  borderBottomWidth: 2,
  borderRadius: 0,
  borderBottomColor: borderBottomColor
}

const $inputStyle: ViewStyle = {
  marginHorizontal: 0
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

const $screenContainer: ViewStyle = {
  backgroundColor: colors.background,
  marginTop: 33
}

const $topContainer: ViewStyle = {
  minHeight: 150,
  justifyContent: "center",
  marginHorizontal: spacing.sm,
  backgroundColor: colors.ems.redColor,
  borderTopStartRadius: 20,
  borderTopEndRadius: 20,
  alignItems: 'center',
}

const $bottomContainer: ViewStyle = {
  flex: 1,
  backgroundColor: colors.palette.neutral100,
  marginHorizontal: spacing.sm,
  justifyContent: "space-around",
  elevation: 2,
  ...Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
    },
  }),
  paddingTop: 10,
  paddingHorizontal: 20
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: RFValue(16),
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderColor: 'rgba(0,0,0,0.2)',
    color: '#0D135A',
    paddingRight: 30,
    flex:1
  },
  inputAndroid: {
    fontSize: RFValue(16),
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderColor: 'rgba(0,0,0,0.2)',
    color: '#0D135A',
    paddingRight: 30,
    textAlign: 'left',
    flex:1
  },
});

const pickerSelectStyles2 = StyleSheet.create({
  inputIOS: {
    fontSize: RFValue(13),
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderColor: 'rgba(0,0,0,0.2)',
    color: '#0D135A',
    paddingRight: 30,
    flex:1
  },
  inputAndroid: {
    fontSize: RFValue(13),
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderColor: 'rgba(0,0,0,0.2)',
    color: '#0D135A',
    paddingRight: 30,
    textAlign: 'left',
    flex:1
  },
});