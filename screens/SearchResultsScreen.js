import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator, Alert, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { apiSearchProducts, BASE_URL } from '../api';
import ListItem from '../customcomponent/listitem';

const { width } = Dimensions.get('window');
const numColumns = 2;

const SearchResultsScreen = ({ route, navigation }) => {
  const { searchQuery } = route.params;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('default');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [searchQuery]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiSearchProducts(searchQuery);
      setProducts(res.data);
    } catch (error) {
      setError(error.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price_asc':
        return a.price - b.price;
      case 'price_desc':
        return b.price - a.price;
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Icon name="alert-circle-outline" size={48} color="#ff3b30" />
        <Text style={styles.errorText}>Không thể tải kết quả tìm kiếm</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchProducts}>
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Kết quả tìm kiếm</Text>
        <Text style={styles.subtitle}>Tìm thấy {products.length} sản phẩm</Text>
      </View>

      {/* Sort Options */}
      <View style={styles.sortContainer}>
        <TouchableOpacity
          style={[styles.sortButton, sortBy === 'price_asc' && styles.sortButtonSelected]}
          onPress={() => setSortBy('price_asc')}
        >
          <Text style={[styles.sortButtonText, sortBy === 'price_asc' && styles.sortButtonTextSelected]}>
            Giá: Thấp đến cao
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortButton, sortBy === 'price_desc' && styles.sortButtonSelected]}
          onPress={() => setSortBy('price_desc')}
        >
          <Text style={[styles.sortButtonText, sortBy === 'price_desc' && styles.sortButtonTextSelected]}>
            Giá: Cao đến thấp
          </Text>
        </TouchableOpacity>
      </View>

      {/* Products List */}
      {sortedProducts.length > 0 ? (
        <FlatList
          data={sortedProducts}
          renderItem={({ item }) => (
            <ListItem
              plant={item}
              onPress={() => navigation.navigate('Detail', { product: item })}
            />
          )}
          keyExtractor={item => item._id}
          numColumns={numColumns}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={[styles.container, styles.centerContent]}>
          <Icon name="search-outline" size={48} color="#666" />
          <Text style={styles.noResultsText}>Không tìm thấy sản phẩm phù hợp</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  sortContainer: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sortButtonSelected: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  sortButtonText: {
    color: '#666',
  },
  sortButtonTextSelected: {
    color: '#fff',
  },
  list: {
    padding: 12,
  },
  errorText: {
    fontSize: 16,
    color: '#ff3b30',
    marginTop: 8,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default SearchResultsScreen; 