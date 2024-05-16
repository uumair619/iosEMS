import * as FileSystem from 'expo-file-system';

export async function imageUrlToBase64(imageUri) {
  try {
    const fileUri = imageUri.replace('file://', '');
    const base64String = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64String;
  } catch (error) {
    console.error('Error converting image to base64:', error);
    return null;
  }
}
