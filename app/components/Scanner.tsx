import React, { useState, useRef, useEffect } from 'react';
import {
    Modal,
    View,
    TouchableOpacity,
    Image,
    StyleSheet,
    StyleProp,
    ViewStyle,
    ImageStyle,
    Pressable,
    Dimensions,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Icon } from './Icon';
import { colors } from 'app/theme';
import { Camera, CameraType, FlashMode } from 'expo-camera';
import { getBase64 } from 'app/utils/helper';
import * as ImageManipulator from 'expo-image-manipulator'
import Toast from 'react-native-root-toast'
import { useSafeAreaInsetsStyle } from 'app/utils/useSafeAreaInsetsStyle';
interface ScannerProps {
    visible: boolean;
    onClose: () => void;
    containerStyle?: StyleProp<ViewStyle>;
    onImageCapture: (imageUri: string | null, attachmentFileOverRide: string | null) => void;
    navigation: any
}

export const Scanner: React.FC<ScannerProps> = ({ visible, onClose, containerStyle, onImageCapture, navigation }) => {
    const [selectedImageUri, setSelectedImageUri] = useState(null);
    const [attachmentFile, setAttachmentFile] = useState(null);
    const [flashMode, setFlashMode] = useState(FlashMode.off);
    const [camera, setCamera] = useState(null);
    const [loading, setLoading] = useState(false);
    const cameraRef = useRef();
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [cameraAspectRatio, setCameraAspectRatio] = useState("16:9");
    const [previewImage, setPreviewImage] = useState(null);

    const $topPadding = useSafeAreaInsetsStyle(["top"])

    useEffect(() => {
        permisionFunction();
    }, []);

    const cameraContainerWidth = Dimensions.get('window').width * 0.91;
    const $camera: ViewStyle = {
        flex: 4,
        width: cameraContainerWidth,
        height: 512,
        alignSelf: 'center',
        backgroundColor: colors.palette.neutral100,
    }

    const onCameraReady = async () => {
        if (cameraRef.current) {
            const ratios = await cameraRef.current.getSupportedRatiosAsync();
            const selectedRatio = ratios.find((ratio) => ratio === '16:9') || ratios[0];
            setCameraAspectRatio(selectedRatio);
            setIsCameraReady(true);
        }
    };


    const permisionFunction = async () => {
        const cameraPermission = await Camera.requestCameraPermissionsAsync();
        const imagePermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (
            imagePermission.status !== 'granted' &&
            cameraPermission.status !== 'granted'
        ) {
            alert('Permission for media access needed.');
        }
    };

    const handleBackPress = () => {
        setSelectedImageUri(null);
        setAttachmentFile(null);
        setCamera(null);
        setLoading(false)
        onClose();
        return true;
    };





    const takePicture = async () => {

        if (cameraRef.current) {
            try {
                setLoading(true)
                const options = {
                    quality: 0,
                    skipProcessing: false,
                    base64: true,
                };

                const data = await cameraRef.current.takePictureAsync(options);
                setAttachmentFile(data?.base64)
                const resizedPhoto = await ImageManipulator.manipulateAsync(
                    data?.uri,
                    [{ resize: { width: 450 } }],
                    { compress: 1, format: ImageManipulator.SaveFormat.JPEG },
                );
                setPreviewImage(data?.uri)
                const base64 = await getBase64(resizedPhoto?.uri);

                setSelectedImageUri(base64);

            } catch (error) {
                setSelectedImageUri(null);
                setAttachmentFile(null)
                console.log("Error occur", error);
                setLoading(false)
            }
        }
    };

    const toggleFlash = () => {
        if (flashMode === FlashMode.off) {
            setFlashMode(FlashMode.torch);
        } else {
            setFlashMode(FlashMode.off);
        }
    };

    const pickImageFromGallery = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
            base64: true
        });

        if (!result.canceled) {
            setPreviewImage(result?.uri)
            setAttachmentFile(result?.base64);
            setSelectedImageUri(result.base64);
        }
    };

    const closeModal = () => {
        onClose();
        setSelectedImageUri(null);
        setPreviewImage(null);
        setCamera(null);
        setLoading(false)
    };

    const selectImage = () => {
        if (!selectedImageUri) {
            Toast.show( "Please select receipt", {
                duration: Toast.durations.LONG,
                position: Toast.positions.CENTER
              });

        }
        if (selectedImageUri) {
            onImageCapture(selectedImageUri, attachmentFile);
            closeModal()
        }
    };

    return (
        <Modal visible={visible} animationType="slide" onRequestClose={handleBackPress}>
            <View style={[$container, containerStyle, selectedImageUri ? { backgroundColor: '#78828E' } : { backgroundColor: '#FFF' },$topPadding]}>
                <View style={[$topSection, selectedImageUri ? { backgroundColor: '#78828E' } : { backgroundColor: '#FFF' }]}>
                    <TouchableOpacity onPress={toggleFlash}>
                        <View style={{ height: 32, width: 32, justifyContent: 'center', alignItems: 'center', borderRadius: 16, backgroundColor: "#F77A34" }}>
                            <Icon icon={flashMode === FlashMode.off ? "flashOff" : "flash"} color='white' />
                        </View>
                    </TouchableOpacity>
                    <View style={$iconContainer}>
                        <TouchableOpacity onPress={pickImageFromGallery}>
                            <Icon icon="gallery" size={32} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={[$camera, selectedImageUri ? { backgroundColor: '#78828E' } : { backgroundColor: '#FFF' }]}>
                    {
                        selectedImageUri ? (
                            <Image source={{ uri: previewImage }} style={[StyleSheet.absoluteFillObject, { marginBottom: 5 }]} resizeMode='contain' />
                        ) : (
                            <Camera
                                ref={cameraRef}
                                style={[
                                    StyleSheet.absoluteFillObject, {
                                        marginBottom: 5

                                    },
                                ]}
                                type={CameraType.back}
                                flashMode={flashMode}
                                onCameraReady={onCameraReady}
                                onMountError={(error) => {
                                    console.log("camera error", error);
                                }}
                                ratio={cameraAspectRatio}

                            />

                        )
                    }
                </View>
                

                <View style={$bottomSection}>
                    <TouchableOpacity onPress={closeModal} style={$circleIcon}>
                        <Icon icon="x" color={colors.ems.redColor} />
                    </TouchableOpacity>
                    <TouchableOpacity disabled={loading} onPress={takePicture} style={$cameraIcon} >
                        <View style={$internalCameraCircle}>
                            <Icon icon="cameraNoCircle" size={20} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={selectImage} style={$circleIcon}>
                        <Icon icon="check" color={colors.ems.redColor} />
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const $internalCameraCircle: ViewStyle = {
    width: 40,
    height: 40,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.ems.redColor,
    padding: 15
}
const $cameraIcon: ViewStyle = {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.palette.neutral100
}

const $circleIcon: ViewStyle & ImageStyle = {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',

}

const $cameraBackground: ViewStyle = {
    flex: 1,
    backgroundColor: 'white',
}

const $container: ViewStyle = {
    flex: 1,
}
const $topSection: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
}
const $iconContainer: ViewStyle = {
    flexDirection: 'row',
}

const $bottomSection: ViewStyle = {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.ems.redColor,
}

