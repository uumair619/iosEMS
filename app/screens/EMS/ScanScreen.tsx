import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import { TextStyle, View, ViewStyle } from "react-native"
import {
  Button,
  Header, Icon, Scanner, Screen,
  Spinner,
  Text,
} from "../../components"
import { colors, spacing } from "../../theme"
import { DemoTabScreenProps } from "app/navigators/DemoNavigator"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { DetectDocumentTextCommand, TextractClient, AnalyzeDocumentCommand, FeatureType } from "@aws-sdk/client-textract";
import { Buffer } from "@craftzdog/react-native-buffer";
import { capitalize, getKeyValueMap, getKeyValueRelationship, getTableData } from "app/utils/textextractHelper"
import { useIsFocused } from "@react-navigation/native"
import { AWS_ACCESS_KEY_ID, AWS_REGION_NAME, AWS_SECRET_ACCESS_KEY } from "app/utils/constants"
import Toast from "react-native-root-toast"

interface ScanScreenProps extends DemoTabScreenProps<"Scan"> { }

const client = new TextractClient({
  region: AWS_REGION_NAME,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

export const ScanScreen: FC<ScanScreenProps> = observer(function ScanScreen(
  _props,
) {

  const { navigation } = _props
  const safeAreaInsets = useSafeAreaInsets();
  const [scannerVisible, setScannerVisible] = useState(false);
  const [scanning, setScanning] = useState(false);
  const isFocused = useIsFocused();
  const [fileResouce, setFileResouce] = useState("");
  const [attachmentFile, setAttachmentFile] = useState("");


  const openScanner = () => {
    setScannerVisible(true);
  };

  useEffect(() => {
    setScanning(false);
    setFileResouce("");
    setAttachmentFile("");
  }, [isFocused])

  

  useEffect(() => {
    // implement the amazon image textractor logic here
    // Send to receipt detail screen with seleted image and data come from amazon api after extracted
    if (fileResouce) {
      scanReceipt();
    }
  }, [fileResouce])
  
  const closeScanner = () => {
    setScannerVisible(false);
  };

  async function scanReceipt() {
   
    setScanning(true);

    try {
      const blob = Buffer.from(fileResouce, 'base64');
      const params = {
        Document: {
          Bytes: blob,
        },
        FeatureTypes: [FeatureType.FORMS, FeatureType.TABLES]
      };


      const command = new AnalyzeDocumentCommand(params);

      try {
        const data = await client.send(command);
        if (data && data.Blocks) {
          const { keyMap, valueMap, blockMap } = getKeyValueMap(data.Blocks);
          const keyValues = getKeyValueRelationship(keyMap, valueMap, blockMap);
          if (keyValues) {
            setScanning(false);
            navigation.navigate("ReceiptCreate", {
              imageUrl: attachmentFile,
              amount: keyValues?.['Total'] || "0.00",
              currency: keyValues?.['Currency'] || "USD",
              date: keyValues?.['Date'] || "Oct 5, 2000",
              merchant: keyValues?.['Merchant'] || "Merchant 1",
              payment_method: ((keyValues?.['Payment Method'] || "CRYPTOCURRENCY")),
              category: ((keyValues?.['Category'] || "CLOTHING"))
            });


          }
          // console.log("ooooh issue occured")
          // console.log("🚀 ~ file: ScanScreen.tsx:67 ~ handleImageCapture ~ keyValues:", keyValues)

          // const tables = getTableData(data.Blocks, blockMap);
          // console.log("🚀 ~ file: ScanScreen.tsx:70 ~ handleImageCapture ~ tables:", tables)

        }

      } catch (error) {
        console.log('err', error.message);
        // error handling.
        Toast.show( error.message, {
          duration: Toast.durations.LONG,
          position: Toast.positions.CENTER
        });
        setScanning(false);
      }

    } catch (error) {
      console.log("Error while extracting data", error.message);
      Toast.show( error.message, {
        duration: Toast.durations.LONG,
        position: Toast.positions.CENTER
      });
      setScanning(false);
    }
    

  }

  const handleImageCapture = async (imageUrl: string | null, serveFile:string | null) => {
    // console.log("🚀 ~ file: ScanScreen.tsx:139 ~ handleImageCapture ~ attachmentFile:", serveFile)
    setAttachmentFile(serveFile);
    setFileResouce(imageUrl);
  };

  return (
    <>
      <Screen
        preset="fixed"
        contentContainerStyle={$screenContentContainer}
        safeAreaEdges={["bottom"]}
      >
        <View>
          <Spinner isLoading={scanning} message="Scanning your receipt, please wait..." />

          <Scanner
            visible={scannerVisible}
            onClose={closeScanner}
            onImageCapture={handleImageCapture}
            containerStyle={$scannerContainer}
            navigation={navigation}
          />
          <Button
            testID="login-button"
            text="Tap To Scan"
            style={$bigButton}
            textStyle={$bigButtonTextStyle}
            preset="reversed"
            onPress={openScanner}
          />
        </View>
      </Screen>

    </>
  )
})
const $scannerContainer: ViewStyle = {}
const $screenContentContainer: ViewStyle = {
  flex: 1,
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
  justifyContent: 'center',
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
