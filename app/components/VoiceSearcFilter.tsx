import React, { useState, useEffect } from 'react';
import Voice from '@react-native-voice/voice';
import { TextField } from './TextField';
import { TextStyle, ViewStyle } from 'react-native';
import { colors, spacing, typography } from 'app/theme';
import { Icon } from './Icon';

interface VoiceSearchFilterProps {
  onSearch: (searchText: string) => void;
}

export const VoiceSearchFilter: React.FC<VoiceSearchFilterProps> = ({ onSearch }) => {
  const [searchKeyWord, setSearchKeyWord] = useState<string>('');

  useEffect(() => {
    Voice.onSpeechStart = (e: any) => {
      
      console.log('Voice.onSpeechStart');
    };
    Voice.onSpeechEnd = (e: any) => {
      console.log('Voice.onSpeechEnd');
    };
    Voice.onSpeechResults = (e: any) => {
      const recognizedText = e.value[0];
      setSearchKeyWord(recognizedText);
      onSearch(recognizedText);
    };
  }, []);

  const voiceSearch = async () => {
    setSearchKeyWord("");
    onSearch("");
    try {
      await Voice.start('en-US');
    } catch (error) {
      console.error('Error starting voice recognition:', error);
    }
  };
  
  const handleKeyboardSubmit = () => {
    onSearch(searchKeyWord);
  };
  
  return (
    <TextField
      value={searchKeyWord}
      onChangeText={setSearchKeyWord}
      containerStyle={$textField}
      autoCapitalize="none"
      autoCorrect={false}
      keyboardType="default"
      placeholderTx="common.search"
      LabelTextProps={{ style: [$labelStyles] }}
      inputWrapperStyle={$inputWrapperStyle}
      style={$inputStyle}
      onSubmitEditing={handleKeyboardSubmit}
      RightAccessory={() => (
        <Icon icon="mic" containerStyle={$customRightAccessoryStyle} onPress={voiceSearch} />
      )}
    />
  );
};

const $customRightAccessoryStyle: ViewStyle = {
  position: 'absolute',
  right: 25,
  bottom: 7,
};

const $inputStyle: ViewStyle = {
  marginHorizontal: 0,
};

const $textField: ViewStyle = {};

const $labelStyles: TextStyle = {
  color: colors.ems.inputLabel,
  fontFamily: typography.fonts.lato.normal,
};

const $inputWrapperStyle: ViewStyle = {
  borderRadius: 25,
  borderBottomColor: colors.ems.borderColor,
  paddingHorizontal: 24,
};
