import * as RNFS from 'react-native-fs'
import { Receipt } from './types';


export async function getBase64(imageUri: string) {
    console.log("imageUri=============>",imageUri)
    const filepath = imageUri.split('//')[1];
    const imageUriBase64 = await RNFS.readFile(filepath, 'base64');
    return imageUriBase64;
    // `data:image/jpeg;base64,${imageUriBase64}`
}

// Calculate the grand total of today expenditures
export function calculateTotalAmount(data: Receipt[]): number {
    // Using reduce to sum up all the amounts
    const totalAmount = data?.reduce((accumulator, receipt) => {
      return accumulator + receipt?.amount;
    }, 0);
    // Rounding to two decimal places
    return Math.round(totalAmount * 100) / 100;
  }


export  function truncateText(inputString: string, maxLength:number) {
    if (inputString?.length <= maxLength) {
      return inputString;
    } else {
      return inputString?.substring(0, maxLength) + "...";
    }
  }