import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get('window');
const numColumns = 2;
const ITEM_WIDTH = width / numColumns - 24;

const API_BASE_URL = 'https://2230d387c90a.ngrok-free.app';

const getImageSource = (img) => {
  if (!img) {
    return require('../img/placeholder.webp');
  }
  
  if (typeof img === 'string') {
    if (img.startsWith('/uploads_product/')) {
      return { uri: `${API_BASE_URL}${img}` };
    }
    if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('data:image')) {
      return { uri: img };
    }
  }
  
  return require('../img/placeholder.webp');
};

const ListItem = ({ plant, onPress }) => {
  const imageSource = getImageSource(plant.image);
  
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image 
        source={imageSource} 
        style={styles.image} 
        resizeMode="cover"
        defaultSource={require('../img/placeholder.webp')}
      />
      <Text style={styles.price}>{plant.price?.toLocaleString('vi-VN')}đ</Text>
      <Text style={styles.name} numberOfLines={2}>{plant.name_Product || plant.name}</Text>
      <TouchableOpacity style={styles.heart}>
        <Text style={styles.heartIcon}>♡</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: ITEM_WIDTH,
    margin: 6,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 8,
    elevation: 2,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  price: {
    fontWeight: 'bold',
    marginTop: 8,
  },
  name: {
    color: '#444',
    fontSize: 13,
    marginTop: 2,
    marginBottom: 8,
  },
  heart: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  heartIcon: {
    fontSize: 20,
  },
});

export default ListItem; 