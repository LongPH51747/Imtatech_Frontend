import React from "react";
import { View, Text, StyleSheet } from "react-native";

const SectionView = ({ title }) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
    marginLeft: 4,
  },
});

export default SectionView; 