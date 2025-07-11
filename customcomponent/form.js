import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

const ButtonForm = ({
  onPress,
  onPressRegister,
  title,
  text,
  subtitle,
}) => (
  <View>
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
    <View style={styles.row}>
      <Text style={styles.text}>{text} </Text>
      <TouchableOpacity onPress={onPressRegister}>
        <Text style={styles.link}>{subtitle}</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#007AFF",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#666",
    fontSize: 16,
  },
  link: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ButtonForm; 