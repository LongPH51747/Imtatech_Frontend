import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { BASE_URL } from './api';

const getImageSource = (img) => {
  if (!img) {
    return require('./img/placeholder.webp');
  }
  
  if (typeof img === 'string') {
    if (img.startsWith('/uploads_product/')) {
      return { uri: `${BASE_URL}${img}` };
    }
    if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('data:image')) {
      return { uri: img };
    }
  }
  
  return require('./img/placeholder.webp');
};

const ProductDetailScreen = ({ route, navigation }) => {
  const { product } = route.params;
  console.log('Product detail data:', product);

  return (
    <ScrollView style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.cartButton}>
          <Icon name="cart-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Product Image */}
      <Image
        source={getImageSource(product.image)}
        style={styles.productImage}
        resizeMode="cover"
        defaultSource={require('./img/placeholder.webp')}
      />

      {/* Product Info */}
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{product.name_Product}</Text>
        <Text style={styles.productPrice}>{product.price?.toLocaleString('vi-VN')}đ</Text>
        
        <View style={styles.ratingContainer}>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Icon
                key={star}
                name={star <= (product.rate || 0) ? "star" : "star-outline"}
                size={20}
                color="#FFD700"
              />
            ))}
          </View>
          <Text style={styles.ratingText}>
            {product.rate || 0} ({product.sold || 0} đã bán)
          </Text>
        </View>

        <View style={styles.divider} />

        {/* Product Details */}
        <View style={styles.detailsContainer}>
          <DetailRow label="Xuất xứ" value={product.origin} />
          <DetailRow label="Kích thước" value={product.size} />
          <DetailRow label="Đặc tính" value={product.attribute} />
          <DetailRow label="Kho" value={`${product.stock} sản phẩm`} />
        </View>

        {/* Add to Cart Button */}
        <TouchableOpacity style={styles.addToCartButton}>
          <Text style={styles.addToCartText}>Thêm vào giỏ hàng</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const DetailRow = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  cartButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  productImage: {
    width: '100%',
    height: 400,
    backgroundColor: '#f5f5f5',
  },
  productInfo: {
    padding: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 20,
    color: '#2ecc71',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    color: '#666',
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 16,
  },
  detailsContainer: {
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  detailLabel: {
    color: '#666',
    fontSize: 16,
  },
  detailValue: {
    color: '#222',
    fontSize: 16,
    fontWeight: '500',
  },
  addToCartButton: {
    backgroundColor: '#2ecc71',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProductDetailScreen; 