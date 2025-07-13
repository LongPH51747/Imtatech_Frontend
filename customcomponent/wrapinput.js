import React from "react";
import { View, TextInput, StyleSheet, Image } from "react-native";

const WrapTextInput = ({
  placeholder,
  value,
  onchangeText,
  icon,
  ...props
}) => (
  <View style={styles.inputContainer}>
    {icon ? (
      <Image source={icon} style={styles.icon} />
    ) : null}
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      value={value}
      onChangeText={onchangeText}
      placeholderTextColor="#888"
      {...props}
    />
  </View>
);

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: "#fff",
    height: 50,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#222",
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
});

export default WrapTextInput; 