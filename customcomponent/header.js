import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";

const Header = ({ back, icon, onPressCart, title, onBack }) => (
  <View style={styles.container}>
    {back ? (
      <TouchableOpacity onPress={onBack}>
        <Image source={require("../img/chevron-left.png")} style={styles.icon} />
      </TouchableOpacity>
    ) : (
      <View style={styles.iconPlaceholder} />
    )}
    <Text style={styles.title}>{title}</Text>
    <TouchableOpacity onPress={onPressCart}>
      <Image source={icon} style={styles.icon} />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    elevation: 2,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
  },
  icon: {
    width: 28,
    height: 28,
  },
  iconPlaceholder: {
    width: 28,
    height: 28,
  },
});

export default Header; 