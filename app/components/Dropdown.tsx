import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, typography } from "app/theme"
import { Text } from "app/components/Text"
import RNPickerSelect, { PickerStyle, PickerSelectProps, Item } from 'react-native-picker-select';

export interface DropdownProps {
  style?: PickerStyle
  label?: string;
  defaultValue?: string | number;
  items: Item;
  key?: any;
  onValueChange: (value: string | number) => void;
  icon?: React.ReactNode
  InputAccessoryView?: React.ReactNode
  darkTheme?: boolean
  disabled?: boolean
  doneText?:string
  fixAndroidTouchableBug?: boolean
  onClose?: () => void
  onDownArrow?: () => void
  onOpen?: () => void
}


export const Dropdown = observer(function Dropdown(props: DropdownProps) {
  const {
    style,
    items,
    label,
    defaultValue,
    onValueChange,
    key,
    icon,
    InputAccessoryView,
    darkTheme,
    disabled,
    doneText,
    fixAndroidTouchableBug,
    onClose,
    onDownArrow,
    onOpen
  } = props

  const renderedItems = Array.isArray(items) && items.length > 0 ? items.map((item) => ({
    label: item.label,
    value: item.value
  })) : [];


  return (
    <RNPickerSelect
      value={defaultValue}
      onValueChange={onValueChange}
      items={renderedItems}
      style={style}
      key={key}
      Icon={icon}
      InputAccessoryView={InputAccessoryView}
      darkTheme={darkTheme}
      disabled={disabled}
      doneText={doneText}
      fixAndroidTouchableBug={fixAndroidTouchableBug}
      onClose={onClose}
      onDownArrow={onDownArrow}
      onOpen={onOpen}
    />
  )
})

const $container: ViewStyle = {
  justifyContent: "center",
}

const $text: TextStyle = {
  fontFamily: typography.primary.normal,
  fontSize: 14,
  color: colors.palette.primary500,
}
