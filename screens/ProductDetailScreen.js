import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { BASE_URL } from '../api';
import { addToCart } from '../redux/actions/cartAction';
import { useAuth } from '../context/AuthContext';
import { useDispatch } from 'react-redux';

const getImageSource = (img) => {
  if (!img) {
    return require('../img/placeholder.webp');
  }

  if (typeof img === 'string') {
    if (img.startsWith('/uploads_product/')) {
      return { uri: `${BASE_URL}${img}` };
    }
    if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('data:image')) {
      return { uri: img };
    }
  }

  return require('../img/placeholder.webp');
};

const ProductDetailScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(0);
  const { product } = route.params;

  const handleIncrease = () => {
    setQuantity(prev => prev + 1);
  };

  const handleDecrease = () => {
    setQuantity(prev => (prev > 0 ? prev - 1 : 0));
  };
  const handleAddToCart = () => {

    const data = {
      cartItem: {
        id_product: product._id,
        quantity: quantity,
      }
    };

    dispatch(addToCart(user?._id, data))
      .then(() => {
        Alert.alert('Thành công', 'Đã thêm sản phẩm vào giỏ hàng!');
      })
      .catch((error) => {
        Alert.alert('Lỗi', 'Không thể thêm sản phẩm. Vui lòng thử lại!');
        console.error(error);
      });
  };

  const totalPrice = quantity * (product.price || 0);
  console.log('Product detail data:', product);
  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 150 }}>
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
          defaultSource={require('../img/placeholder.webp')}
        />

        {/* Product Info */}
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.name_Product}</Text>
          <Text style={styles.productPrice}>
            {product.price?.toLocaleString('vi-VN')}đ
          </Text>

          <View style={styles.ratingContainer}>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Icon
                  key={star}
                  name={star <= (product.rate || 0) ? 'star' : 'star-outline'}
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
        </View>
      </ScrollView>

      {/* Fixed Bottom Bar */}
      <View style={styles.bottomBar}>
        {/* Dòng "Đã chọn X sản phẩm" */}
        <Text style={styles.selectedText}>Đã chọn {quantity} sản phẩm</Text>

        <View style={styles.controlRow}>
          {/* Nhóm nút cộng/trừ */}
          <View style={styles.quantityControl}>
            <TouchableOpacity style={styles.qtyButton} onPress={handleDecrease}>
              <Text style={styles.qtySymbol}>-</Text>
            </TouchableOpacity>

            <Text style={styles.qtyNumber}>{quantity}</Text>

            <TouchableOpacity style={styles.qtyButton} onPress={handleIncrease}>
              <Text style={styles.qtySymbol}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Nhóm tạm tính */}
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Tạm tính</Text>
            <Text style={styles.totalText}>
              {totalPrice.toLocaleString('vi-VN')}đ
            </Text>
          </View>
        </View>

        {/* Nút chọn mua */}
        <TouchableOpacity
          style={[
            styles.buyButton,
            { backgroundColor: quantity > 0 ? '#2ecc71' : '#ccc' },
          ]}
          disabled={quantity === 0}
          onPress={handleAddToCart}
        >
          <Text style={styles.buyButtonText}>Thêm vào giỏ hàng</Text>
        </TouchableOpacity>

      </View>


    </View>

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
  }, bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#eee',
  },

  selectedText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },

  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 10
  },

  qtyButton: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },

  qtySymbol: {
    fontSize: 16,
    color: '#000',
  },

  qtyNumber: {
    marginHorizontal: 6,
    fontSize: 14,
  },

  totalContainer: {
    alignItems: 'flex-end',
  },

  totalLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },

  totalText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
  },

  buyButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },

  buyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },


});

export default ProductDetailScreen; 